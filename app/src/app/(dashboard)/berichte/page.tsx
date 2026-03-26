"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import { SkeletonListRow } from "@/components/dashboard/Skeleton";
import { useOrg } from "@/lib/hooks/useOrg";
import { useLocale } from "@/i18n/LocaleContext";
import PlanBadge from "@/components/dashboard/PlanBadge";
import type { Report, ReportMaterial } from "@/types";

export default function BerichtePage() {
  const { org } = useOrg();
  const { t } = useLocale();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

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
        <div className="bg-white rounded-none border divide-y">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonListRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">Analytics</p>
        <h1 className="text-2xl font-bold text-gray-900">{t("reports.title")}</h1>
        <p className="text-gray-500 mt-1">
          {t("reports.subtitle")}
        </p>
      </div>

      {reports.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-none border shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-700" />
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-none bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {report.report_type === "daily"
                      ? t("reports.daily")
                      : report.report_type === "weekly"
                      ? t("reports.weekly")
                      : t("reports.monthly")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(report.period_start)} – {formatDate(report.period_end)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <a
                  href={`/api/export/report?id=${report.id}`}
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-none transition-colors duration-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" /></svg>
                  CSV
                </a>
                {org?.features_pdf_reports && (
                  <a
                    href={`/api/export/report-pdf?id=${report.id}`}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-none transition-colors duration-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" /></svg>
                    PDF {org?.plan === "trial" && <PlanBadge plan="Team" />}
                  </a>
                )}
                <button
                  onClick={() => setSelectedReport(report)}
                  className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-none transition-colors duration-200"
                >
                  {t("reports.read")}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-none border shadow-sm">
          <div className="w-16 h-16 rounded-none bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">{t("reports.noReports")}</p>
          <p className="text-gray-400 mt-2">
            {t("reports.noReportsHint")}
          </p>
        </div>
      )}

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl">
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
            ) : selectedReport.content_json?.materials ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  {formatDate(selectedReport.content_json.period?.start || selectedReport.period_start)}
                  {" – "}
                  {formatDate(selectedReport.content_json.period?.end || selectedReport.period_end)}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-gray-500">
                        <th className="pb-2 font-medium">{t("reports.colMaterial")}</th>
                        <th className="pb-2 font-medium text-right">{t("reports.colPrice")}</th>
                        <th className="pb-2 font-medium text-right">{t("reports.colChange")}</th>
                        <th className="pb-2 font-medium">{t("reports.colTrend")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedReport.content_json.materials.map((mat: ReportMaterial, i: number) => (
                        <tr key={i}>
                          <td className="py-2 font-medium">{mat.name_de || mat.name}</td>
                          <td className="py-2 text-right">
                            {mat.price_eur ? `€${parseFloat(mat.price_eur).toLocaleString("de-DE", { minimumFractionDigits: 2 })}` : "–"}
                          </td>
                          <td className="py-2 text-right">
                            {mat.change_pct_7d != null ? (
                              <span className={parseFloat(mat.change_pct_7d) > 0 ? "text-brand-600" : parseFloat(mat.change_pct_7d) < 0 ? "text-[#F5C518]" : "text-gray-500"}>
                                {parseFloat(mat.change_pct_7d) > 0 ? "+" : ""}{parseFloat(mat.change_pct_7d).toFixed(2)}%
                              </span>
                            ) : "–"}
                          </td>
                          <td className="py-2">
                            {mat.trend === "rising" ? t("reports.trendRising") : mat.trend === "falling" ? t("reports.trendFalling") : mat.trend === "stable" ? t("reports.trendStable") : "–"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <pre className="text-sm whitespace-pre-wrap text-gray-600">
                {JSON.stringify(selectedReport.content_json, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
