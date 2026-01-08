export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  traceId?: string;
  timestamp?: number;
};

export type User = {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
  verified: boolean;
};

export type ExtractionProfile = "GENERIC" | "INVOICE" | "BANK_STATEMENT";

export type OutputFormat = "JSON" | "CSV" | "MARKDOWN";

export type FileAsset = {
  id: number;
  originalName: string;
  mimeType: string;
  size: number;
  sha256: string;
  storageKey: string;
  createdAt: string;
};

export type ExtractionJobStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type ExtractionJob = {
  id: number;
  profile: ExtractionProfile;
  status: ExtractionJobStatus;
  pages?: number | null;
  outputFormats: string;
  error?: string | null;
  createdAt: string;
  startedAt?: string | null;
  finishedAt?: string | null;
  fileAsset?: FileAsset;
};

export type ExtractionResult = {
  id: number;
  format: OutputFormat;
  contentLocation: string;
  previewSnippet?: string | null;
  createdAt: string;
};

export type JobDetail = ExtractionJob & {
  results?: ExtractionResult[];
};
