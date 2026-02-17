"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";

/** Check whether Clerk is configured (live or test key). */
function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return key.startsWith("pk_live_") || key.startsWith("pk_test_");
}

interface SessionInfo {
  id: string;
  browser: string;
  os: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

interface ClerkUserData {
  twoFactorEnabled: boolean;
  sessions: SessionInfo[];
}

/** Safely extract session / 2FA info from Clerk hooks. */
function useClerkData(): {
  data: ClerkUserData | null;
  loading: boolean;
  signOutAll: (() => Promise<void>) | null;
} {
  const [data, setData] = useState<ClerkUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [signOutAllFn, setSignOutAllFn] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (!isClerkConfigured()) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadClerkData() {
      try {
        // We cannot call hooks outside React components, so we rely on
        // the Clerk global instance instead (window.Clerk).
        // Give Clerk a moment to initialise on the client.
        const waitForClerk = (): Promise<any> =>
          new Promise((resolve) => {
            const check = () => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const c = (window as any).Clerk;
              if (c && c.user) {
                resolve(c);
              } else {
                setTimeout(check, 200);
              }
            };
            check();
          });

        const clerkInstance = await waitForClerk();
        if (cancelled) return;

        const user = clerkInstance.user;
        const session = clerkInstance.session;

        // 2FA status
        const twoFactorEnabled =
          user?.twoFactorEnabled === true ||
          (user?.totpEnabled ?? false);

        // Build sessions list — Clerk exposes activeSessions on the client
        const activeSessions: any[] = clerkInstance.client?.activeSessions ?? [];
        const sessions: SessionInfo[] = activeSessions.map((s: any) => {
          const la = s.lastActiveAt
            ? new Date(s.lastActiveAt).toISOString()
            : new Date().toISOString();
          const browser =
            s.latestActivity?.browserName ||
            s.latestActivity?.deviceType ||
            "Browser";
          const os = s.latestActivity?.isMobile ? "Mobile" : "Desktop";
          return {
            id: s.id,
            browser,
            os,
            lastActiveAt: la,
            isCurrent: session ? s.id === session.id : false,
          };
        });

        // Sign-out-all function
        const doSignOutAll = async () => {
          try {
            await clerkInstance.signOut();
            window.location.href = "/";
          } catch {
            window.location.href = "/";
          }
        };

        if (!cancelled) {
          setData({ twoFactorEnabled, sessions });
          setSignOutAllFn(() => doSignOutAll);
        }
      } catch {
        // Clerk not available — silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadClerkData();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, signOutAll: signOutAllFn };
}

export default function SecurityPage() {
  const { t } = useLocale();
  const clerkConfigured = isClerkConfigured();
  const { data: clerkData, loading, signOutAll } = useClerkData();

  // Dev mode — Clerk not configured
  if (!clerkConfigured) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
        <p>{t("account.security.devMode")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  const twoFactorEnabled = clerkData?.twoFactorEnabled ?? false;
  const sessions = clerkData?.sessions ?? [];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Section 1: Access */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>{"🔐"}</span>
          <span>{t("account.security.access")}</span>
        </h2>

        <div className="space-y-5">
          {/* Password */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {t("account.security.changePassword")}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {t("account.security.passwordManaged")}
            </p>
            <button
              onClick={() => {
                // Open Clerk's user profile / manage account page
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const clerk = (window as any).Clerk;
                if (clerk?.openUserProfile) {
                  clerk.openUserProfile();
                } else {
                  window.open(
                    window.location.origin + "/user-profile",
                    "_blank"
                  );
                }
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              {t("account.security.manageAccount")}
            </button>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* 2FA */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {t("account.security.twoFactor")}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {t("account.security.twoFactorDesc")}
            </p>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  twoFactorEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {twoFactorEnabled
                  ? t("account.security.enabled")
                  : t("account.security.disabled")}
              </span>
              <button
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const clerk = (window as any).Clerk;
                  if (clerk?.openUserProfile) {
                    clerk.openUserProfile();
                  } else {
                    window.open(
                      window.location.origin + "/user-profile",
                      "_blank"
                    );
                  }
                }}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium transition"
              >
                {twoFactorEnabled
                  ? t("account.security.disable")
                  : t("account.security.enable")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Active Sessions */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("account.security.sessions")}
        </h2>

        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-lg">
                    {session.os === "Mobile" ? "📱" : "💻"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.browser}
                      {session.os ? ` · ${session.os}` : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.lastActiveAt).toLocaleString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {session.isCurrent && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-100 text-brand-700">
                    {t("account.security.current")}
                  </span>
                )}
              </div>
            ))}

            {/* Logout All */}
            {sessions.length > 1 && signOutAll && (
              <div className="pt-3">
                <button
                  onClick={signOutAll}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition"
                >
                  {t("account.security.logoutAll")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            {t("account.security.current")}
          </p>
        )}
      </div>

      {/* Section 3: Danger Zone */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
          <span>{"⚠️"}</span>
          <span>{t("account.security.dangerZone")}</span>
        </h2>
        <p className="text-sm text-red-600 mb-4">
          {t("account.security.deleteDesc")}
        </p>
        <Link
          href="/account/data"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-red-300 text-red-700 bg-white hover:bg-red-50 transition"
        >
          {t("account.security.deleteLink")}
        </Link>
      </div>
    </div>
  );
}
