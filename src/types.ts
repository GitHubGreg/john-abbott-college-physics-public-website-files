export interface ManifestEntry {
  title: string;
  category: string;
  course: string;
  subsection: string;
  sourcePath: string;
  publicPath: string;
  url: string;
  extension: string;
  sizeBytes: number;
  modified: string;
}

export interface ScannedFile {
  absolutePath: string;
  relativeSourcePath: string;
  category: string;
  course: string;
  subsection: string;
  title: string;
  extension: string;
  sizeBytes: number;
  modified: Date;
}

export interface ResolvedFile extends ScannedFile {
  publicPath: string;
  url: string;
}

export interface ScanResult {
  publishable: ScannedFile[];
  skippedIgnored: string[];
  skippedBlocked: string[];
}

export interface PublishSummary {
  published: ResolvedFile[];
  skippedIgnored: string[];
  skippedBlocked: string[];
}
