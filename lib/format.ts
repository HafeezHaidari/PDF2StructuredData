import type { ExtractionJobStatus } from "@/lib/types";

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "—";
  const units = ["B", "KB", "MB", "GB"] as const;
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function statusLabel(status: ExtractionJobStatus): string {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "PROCESSING":
      return "Processing";
    case "COMPLETED":
      return "Completed";
    case "FAILED":
      return "Failed";
  }
}

export function statusClasses(status: ExtractionJobStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100";
    case "PROCESSING":
      return "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100";
    case "FAILED":
      return "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-100";
  }
}
