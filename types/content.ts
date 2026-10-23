export type IconName =
  | "procurement" | "contract" | "fidic" | "mou" | "notary" | "documents"
  | "quantity" | "claims" | "governance" | "training"
  | "check" | "arrow" | "calendar" | "shield" | "clock" | "message" | "scale-free" | "layers";

export type ServiceStatus = "published" | "draft";

export type ServiceCategory =
  | "fidic" | "quantity_surveying" | "contract" | "claims" | "procurement"
  | "governance" | "documentation" | "training" | "notarial";

export interface ServiceContent {
  slug: string;
  /** Used for booking/inquiry categories. */
  category: ServiceCategory;
  title: string;
  shortTitle: string;
  icon: IconName;
  status: ServiceStatus;
  /** False until the owner has confirmed every scope item listed below. */
  scopeConfirmed: boolean;
  summary: string;
  clientValue: string;
  intro: string[];
  covers: { title: string; text: string }[];
  whoMayNeed: string[];
  problems: string[];
  deliverables: string[];
  process: { title: string; text: string }[];
  prepare: string[];
  limitations: string[];
  cta: string;
  /** Slugs of the services shown under "Related services". */
  related: string[];
  seo: { title: string; description: string };
}

export interface ArticleContent {
  slug: string;
  title: string;
  excerpt: string;
  category: "Contract administration" | "Procurement" | "MoUs" | "Working with us" | "FIDIC";
  author: string;
  /** Articles stay drafts until reviewed by the owner. */
  status: "published" | "draft";
  publishedAt: string | null;
  updatedAt: string;
  readingMinutes: number;
  body: ArticleBlock[];
  related: string[];
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "note"; text: string };
