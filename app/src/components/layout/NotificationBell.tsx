"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import type { Notification } from "@/types";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  // Poll unread count every 60s
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread-count");
      if (res.ok) {
        const data = await res.json();
        setCount(data.count ?? 0);
      }
    } catch {
      // Silently ignore — non-critical
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 60_000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Fetch full list when dropdown opens
  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          setItems(await res.json());
        }
      } catch {
        // Silently ignore
      }
      setLoading(false);
    }
  }

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
    setCount((c) => Math.max(0, c - 1));
  }

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
    setCount(0);
  }

  function formatTime(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  const badgeText = count > 99 ? "99+" : String(count);

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer relative"
        aria-label={t("notifications.title") || "Benachrichtigungen"}
      >
        {/* Bauhaus geometric bell SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Badge */}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center bg-brand-600 text-white text-[10px] font-bold rounded-full px-1 motion-safe:animate-pulse">
            {badgeText}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0_#C1292E] z-50 md:w-80 max-md:fixed max-md:inset-x-4 max-md:top-14 max-md:w-auto max-md:max-h-[60vh]">
          {/* Header */}
          <div className="px-4 py-3 border-b-2 border-[#1A1A1A] bg-gray-50 flex items-center justify-between">
            <span className="font-grotesk text-xs uppercase tracking-wide font-bold text-[#1A1A1A]">
              {t("notifications.title") || "Benachrichtigungen"}
            </span>
            {count > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-grotesk uppercase tracking-wide text-brand-600 hover:text-brand-700 cursor-pointer font-semibold"
              >
                {t("notifications.markAllRead") || "Alle gelesen"}
              </button>
            )}
          </div>

          {/* Items */}
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">...</div>
          ) : items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400 font-grotesk">
              {t("notifications.empty") || "Keine Benachrichtigungen"}
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.read_at) markRead(item.id);
                  if (item.link) {
                    setOpen(false);
                    window.location.href = item.link;
                  }
                }}
                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !item.read_at ? "bg-brand-50/30 border-l-2 border-l-brand-600" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-grotesk font-semibold text-[#1A1A1A] leading-tight">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-gray-400 font-grotesk whitespace-nowrap flex-shrink-0">
                    {formatTime(item.created_at)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.message}</p>
              </div>
            ))
          )}

          {/* Footer */}
          <Link
            href="/alerts"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-center text-xs font-grotesk uppercase tracking-wide font-bold text-brand-600 hover:bg-brand-50 transition-colors border-t-2 border-[#1A1A1A]"
          >
            {t("notifications.showAll") || "Alle anzeigen"} →
          </Link>
        </div>
      )}
    </div>
  );
}
