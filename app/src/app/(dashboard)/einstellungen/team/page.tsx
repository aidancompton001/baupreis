"use client";

import { useEffect, useState } from "react";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import UpgradeCard from "@/components/dashboard/UpgradeCard";
import { formatDate } from "@/lib/utils";

interface Member {
  id: string;
  email: string;
  name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
  created_at: string;
}

const ROLE_COLORS: Record<string, string> = {
  owner: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  member: "bg-gray-100 text-gray-700",
};

export default function TeamPage() {
  const { org, loading: orgLoading } = useOrg();
  const { t } = useLocale();

  const ROLE_LABELS: Record<string, string> = {
    owner: t("team.roles.owner"),
    admin: t("team.roles.admin"),
    member: t("team.roles.member"),
  };
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [maxUsers, setMaxUsers] = useState(1);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (orgLoading) return;
    if ((org?.max_users ?? 1) <= 1) {
      setLoading(false);
      return;
    }
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => {
        if (data.members) setMembers(data.members);
        if (data.invites) setInvites(data.invites);
        if (data.max_users) setMaxUsers(data.max_users);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [org, orgLoading]);

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("team.inviteError"));
        return;
      }
      setSuccess(t("team.inviteSuccess", { email: inviteEmail }));
      setInviteEmail("");
      // Refresh
      const listRes = await fetch("/api/team");
      const listData = await listRes.json();
      if (listData.members) setMembers(listData.members);
      if (listData.invites) setInvites(listData.invites);
    } catch {
      setError(t("common.networkError"));
    } finally {
      setInviting(false);
    }
  }

  async function handleChangeRole(memberId: string, newRole: string) {
    await fetch(`/api/team/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  }

  async function handleRemove(memberId: string) {
    await fetch(`/api/team/${memberId}`, { method: "DELETE" });
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  if (orgLoading || loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("team.title")}</h1>
          <p className="text-gray-600">{t("team.subtitle")}</p>
        </div>
        <div className="bg-white rounded-xl border p-8 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if ((org?.max_users ?? 1) <= 1) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("team.title")}</h1>
          <p className="text-gray-600">{t("team.subtitle")}</p>
        </div>
        <UpgradeCard feature={t("team.title")} requiredPlan="Team" icon="👥" />
      </div>
    );
  }

  const activeCount = members.filter((m) => m.is_active).length;
  const pendingCount = invites.length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("team.title")}</h1>
        <p className="text-gray-600">
          {pendingCount > 0
            ? t("team.statsPending", { active: activeCount, max: maxUsers, pending: pendingCount })
            : t("team.stats", { active: activeCount, max: maxUsers })}
        </p>
      </div>

      {/* Invite form */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-semibold mb-3">{t("team.inviteSection")}</h2>
        <div className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder={t("team.inviteEmail")}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="member">{t("team.roles.member")}</option>
            <option value="admin">{t("team.roles.admin")}</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={inviting || !inviteEmail.trim()}
            className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition"
          >
            {inviting ? t("team.inviting") : t("team.inviteButton")}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </div>

      {/* Members list */}
      <div className="bg-white rounded-xl border mb-6">
        <div className="p-4 border-b">
          <h2 className="font-semibold">{t("team.membersSection")}</h2>
        </div>
        <div className="divide-y">
          {members.filter((m) => m.is_active).map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{member.name || member.email}</p>
                {member.name && (
                  <p className="text-sm text-gray-500">{member.email}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  {t("team.memberJoined", { date: formatDate(member.created_at) })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    ROLE_COLORS[member.role] || ROLE_COLORS.member
                  }`}
                >
                  {ROLE_LABELS[member.role] || member.role}
                </span>
                {member.role !== "owner" && (
                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => handleChangeRole(member.id, e.target.value)}
                      className="text-xs border rounded px-1.5 py-1"
                    >
                      <option value="member">{t("team.roles.member")}</option>
                      <option value="admin">{t("team.roles.admin")}</option>
                    </select>
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      {t("team.memberRemove")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending invites */}
      {invites.length > 0 && (
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">{t("team.pendingSection")}</h2>
          </div>
          <div className="divide-y">
            {invites.map((invite) => (
              <div key={invite.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{invite.email}</p>
                  <p className="text-xs text-gray-400">
                    {t("team.pendingInvited", { created: formatDate(invite.created_at), expires: formatDate(invite.expires_at) })}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                  {t("team.pendingStatus")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
