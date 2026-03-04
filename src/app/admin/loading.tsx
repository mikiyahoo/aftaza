export default function AdminLoading() {
  return (
    <div data-header-text="light" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-[#c8a34d] rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-400">
        Initializing_Admin_Environment...
      </p>
    </div>
  );
}