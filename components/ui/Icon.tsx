import type { IconName } from "@/types/content";

/** Simple 1.5px line icons drawn on a 24px grid. Decorative unless labelled. */
const paths: Record<IconName, React.ReactNode> = {
  procurement: (<><path d="M4 7h16M4 12h10M4 17h7" /><circle cx="17.5" cy="16.5" r="2.5" /><path d="m19.5 18.5 1.5 1.5" /></>),
  contract: (<><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 11h5M10 14.5h5M10 18h3" /></>),
  fidic: (<><path d="M3 20h18M5 20V10l7-5 7 5v10" /><path d="M9 20v-6h6v6M9 10.5h6" /></>),
  mou: (<><path d="M4 6h7v12H4zM13 6h7v12h-7z" /><path d="M6.5 10h2.5M6.5 13h2.5M15.5 10h2.5M15.5 13h2.5" /></>),
  notary: (<><circle cx="12" cy="10" r="5" /><path d="m9.5 14.5-1.5 6 4-2 4 2-1.5-6" /><path d="M12 7.5v5M9.5 10h5" /></>),
  documents: (<><path d="M8 7V3h9l3 3v12h-4" /><path d="M4 7h9l3 3v11H4z" /><path d="M7 13h6M7 16.5h6" /></>),
  quantity: (<><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M8 7h8M8 11h2M12 11h1M15 11h1M8 14.5h2M12 14.5h1M15 14.5h1M8 18h2M12 18h4" /></>),
  claims: (<><path d="M12 4v16M8 20h8" /><path d="M5 8h14" /><path d="m5 8-2.5 6h5zM19 8l-2.5 6h5z" /></>),
  governance: (<><path d="M4 9.5 12 4l8 5.5M5 20h14M6 10v8M10 10v8M14 10v8M18 10v8" /></>),
  training: (<><path d="m2.5 9 9.5-4.5L21.5 9 12 13.5z" /><path d="M6.5 11v5c1.5 1.5 3.5 2.2 5.5 2.2s4-.7 5.5-2.2v-5M21.5 9v5" /></>),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  calendar: (<><rect x="4" y="5" width="16" height="15" rx="1" /><path d="M4 9.5h16M8.5 3v4M15.5 3v4" /></>),
  shield: (<><path d="M12 3 5 6v5.5c0 4.4 3 7.9 7 9.5 4-1.6 7-5.1 7-9.5V6z" /><path d="m9 12 2 2 4-4" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
  message: (<><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></>),
  "scale-free": <path d="M4 12h16M12 4v16" />,
  layers: (<><path d="m12 4 8 4-8 4-8-4z" /><path d="m4 12 8 4 8-4M4 16l8 4 8-4" /></>),
};

export function Icon({ name, className = "h-6 w-6", label }: { name: IconName; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {paths[name]}
    </svg>
  );
}
