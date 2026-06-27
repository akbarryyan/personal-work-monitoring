export default function WorkspaceLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-[2.5px] border-blue-100 border-t-blue-500" />
        <p className="text-[13px] text-gray-400">Loading…</p>
      </div>
    </div>
  );
}
