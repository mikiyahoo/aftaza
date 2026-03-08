type DatabaseStatusNoticeProps = {
  title?: string;
  message: string;
};

export default function DatabaseStatusNotice({
  title = "Database Unavailable",
  message,
}: DatabaseStatusNoticeProps) {
  return (
    <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">
        {title}
      </p>
      <p className="mt-2 text-sm text-amber-900">{message}</p>
    </div>
  );
}
