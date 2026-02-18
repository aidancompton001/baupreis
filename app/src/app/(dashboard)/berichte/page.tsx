"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import { SkeletonListRow } from "@/components/dashboard/Skeleton";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import PlanBadge from "@/components/dashboard/PlanBadge";

export default function BerichtePage() {
  const { org } = useOrg();
  const { t } = useLocale();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReports(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("reports.title")}</h1>
          <p className="text-gray-600">
            {t("reports.subtitle")}
          </p>
        </div>
        <div className="bg-white rounded-xl border divide-y">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonListRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("reports.title")}</h1>
        <p className="text-gray-600">
          {t("reports.subtitle")}
        </p>
      </div>

      {reports.length > 0 ? (
        <div className="bg-white rounded-xl border divide-y">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {report.report_type === "daily"
                    ? t("reports.daily")
                    : report.report_type === "weekly"
                    ? t("reports.weekly")
                    : t("reports.monthly")}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(report.period_start)} –{" "}
                  {formatDate(report.period_end)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`/api/export/report?id=${report.id}`}
                  download
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  CSV
                </a>
                {org?.features_pdf_reports && (
                  <a
                    href={`/api/export/report-pdf?id=${report.id}`}
                    download
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    PDF {org?.plan === "trial" && <PlanBadge plan="Team" />}
                  </a>
                )}
                <button
                  onClick={() => setSelectedReport(report)}
                  className="text-brand-600 hover:text-brand-700 text-sm font-medium"
                >
                  {t("reports.read")}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500 text-lg">{t("reports.noReports")}</p>
          <p className="text-gray-400 mt-2">
            {t("reports.noReportsHint")}
          </p>
        </div>
      )}

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {selectedReport.report_type === "daily"
                  ? t("reports.daily")
                  : selectedReport.report_type === "weekly"
                  ? t("reports.weekly")
                  : t("reports.monthly")}
              </h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            {selectedReport.content_html ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(selectedReport.content_html),
                }}
              />
            ) : (
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(selectedReport.content_json, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
