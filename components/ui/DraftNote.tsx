import { draftPreview } from "@/lib/env";

/**
 * Visible only in draft preview: marks content the owner must supply or
 * confirm. Renders nothing on the public production site.
 */
export function DraftNote({ children, inline = false }: { children: React.ReactNode; inline?: boolean }) {
  if (!draftPreview) return null;
  const Tag = inline ? "span" : "div";
  return (
    <Tag
      className={`${inline ? "inline-block" : "my-3 block"} rounded-sm border border-dashed border-bronze/60 bg-[#fbf6ec] px-3 py-2 font-sans text-[0.82rem] leading-snug text-[#6b4f22]`}
      data-draft-note=""
    >
      <strong className="mr-1 font-semibold uppercase tracking-wide">To confirm:</strong>
      {children}
    </Tag>
  );
}
