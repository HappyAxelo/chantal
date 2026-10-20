/**
 * Original line composition: a structural elevation on drafting grid,
 * overlaid with a contract schedule. Stands in for photography until
 * approved images are supplied (see README: Imagery).
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[5/6] w-full max-w-[480px]" aria-hidden="true">
      <svg viewBox="0 0 400 480" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="hv-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="rgb(var(--navy))" strokeOpacity=".07" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="400" height="480" fill="rgb(var(--canvas))" />
        <rect x="0" y="0" width="400" height="480" fill="url(#hv-grid)" />

        {/* structural elevation */}
        <g fill="none" stroke="rgb(var(--navy))" strokeWidth="1.25" strokeOpacity=".75">
          <path d="M40 420h320" />
          <path d="M70 420V170h140v250M210 420V110h110v310" />
          <path d="M70 230h140M70 290h140M70 350h140M210 170h110M210 230h110M210 290h110M210 350h110" strokeOpacity=".35" />
          <path d="M116 170v250M163 170v250M246 110v310M283 110v310" strokeOpacity=".35" />
          <path d="M70 170l46 60M116 170l-46 60M210 110l36 60M246 110l-36 60" strokeOpacity=".3" />
        </g>
        {/* dimension line */}
        <g stroke="rgb(var(--slate))" strokeWidth="1" fill="none">
          <path d="M210 92h110M210 86v12M320 86v12" />
        </g>
        <rect x="244" y="83" width="42" height="16" fill="rgb(var(--canvas))" />
        <text x="265" y="95" textAnchor="middle" fontSize="10" fill="rgb(var(--slate))" fontFamily="var(--font-sans)">14.2</text>
      </svg>

      {/* contract schedule card */}
      <div className="absolute -bottom-6 -left-4 w-[64%] rounded border border-line bg-white p-5 shadow-lift sm:-left-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-ink-muted">Obligations register</span>
          <span className="h-2 w-2 bg-bronze-soft" />
        </div>
        {[
          ["Notice of change", "w-[70%]"],
          ["Interim payment", "w-[52%]"],
          ["Programme update", "w-[84%]"],
          ["Close-out records", "w-[38%]"],
        ].map(([label, width]) => (
          <div key={label} className="border-t border-line py-2.5">
            <div className="flex items-center justify-between text-[0.72rem] text-ink">
              <span>{label}</span>
              <span className="h-3 w-3 rounded-sm border border-navy/40" />
            </div>
            <div className="mt-2 h-1 bg-slate-soft">
              <div className={`h-1 bg-navy/70 ${width}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
