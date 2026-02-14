export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        <p className="text-gray-500">Wird geladen...</p>
      </div>
    </div>
  );
}
