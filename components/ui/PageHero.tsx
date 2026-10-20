import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

const grid = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
};

export function PageHero({ eyebrow, title, lede, crumbs, children }: {
  eyebrow?: string;
  title: string;
  lede?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-navy text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06]" style={grid} />
      <div className="container relative pb-16 pt-10 md:pb-20 md:pt-12">
        {crumbs && <div className="mb-10"><Breadcrumbs items={crumbs} light /></div>}
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-white">{title}</h1>
          {lede && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">{lede}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
