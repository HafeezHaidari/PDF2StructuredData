export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid size-9 place-items-center rounded-lg bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
        PDF
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold">PDF Processor</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Extract structured data
        </div>
      </div>
    </div>
  );
}
