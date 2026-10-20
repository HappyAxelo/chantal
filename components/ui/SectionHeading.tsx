export function SectionHeading({ eyebrow, title, lede, align = "left", id }: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {lede && <p className="lede mt-5">{lede}</p>}
    </div>
  );
}
