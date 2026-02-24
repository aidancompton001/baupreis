"use client";

import { useState, useRef, useEffect } from "react";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import TrialFeatureBanner from "@/components/dashboard/TrialFeatureBanner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { org, loading: orgLoading } = useOrg();
  const { t } = useLocale();

  const STARTER_CHIPS = [
    t("chat.starter1"),
    t("chat.starter2"),
    t("chat.starter3"),
    t("chat.starter4"),
  ];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    setError(null);
    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    // Add empty assistant message for streaming
    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, locale: document.cookie.match(/locale=(\w+)/)?.[1] || "de" }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || `Fehler ${res.status}`
        );
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error(t("chat.errorNoStream"));

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              accumulated += parsed.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: accumulated,
                };
                return updated;
              });
            }
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }
    } catch (err: any) {
      setError(err.message || t("chat.errorGeneric"));
      // Remove empty assistant message on error
      setMessages((prev) => {
        if (prev[prev.length - 1]?.content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (org && !org.features_forecast) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("chat.title")}
          </h1>
          <p className="text-gray-600">
            {t("chat.subtitle")}
          </p>
        </div>
        <div className="mt-8">
          <UpgradeCard
            feature={t("chat.upgradeFeature")}
            requiredPlan="Pro"
            description={t("chat.upgradeDescription")}
            icon="💬"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("chat.title")}
        </h1>
        <p className="text-gray-600">
          {t("chat.subtitle")}
        </p>
      </div>

      {org?.plan === "trial" && <TrialFeatureBanner plan="Pro" />}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl border p-4 mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="text-4xl mb-4">💬</span>
            <p className="text-gray-500 mb-6">
              {t("chat.subtitle")}
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {STARTER_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="text-sm px-3 py-2 rounded-lg border bg-gray-50 text-gray-700 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {msg.content}
              {msg.role === "assistant" && msg.content === "" && isStreaming && (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chat.placeholder")}
          rows={1}
          className="flex-1 border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
          disabled={isStreaming}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isStreaming}
          className="bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition text-sm font-medium disabled:opacity-50"
        >
          {isStreaming ? t("chat.sending") : t("chat.send")}
        </button>
      </div>
    </div>
  );
}
