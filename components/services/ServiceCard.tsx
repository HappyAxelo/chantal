import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { ServiceContent } from "@/types/content";

export function ServiceCard({ service, index }: { service: ServiceContent; index?: number }) {
  return (
    <article className="group relative flex h-full flex-col border-t-2 border-navy/10 bg-white p-7 transition-colors hover:border-bronze-soft md:p-8">
      <div className="mb-6 flex items-start justify-between">
        <span className="text-navy"><Icon name={service.icon} className="h-8 w-8" /></span>
        {index !== undefined && <span className="font-serif text-sm text-ink-muted">{String(index + 1).padStart(2, "0")}</span>}
      </div>
      <h3 className="mb-3">
        <Link href={`/services/${service.slug}`} className="no-underline after:absolute after:inset-0 after:content-['']">
          {service.title}
        </Link>
      </h3>
      <p className="text-[0.98rem] text-ink-muted">{service.summary}</p>
      <p className="mt-4 border-l-2 border-bronze-soft/60 pl-3 text-[0.92rem] text-ink">{service.clientValue}</p>
      <span className="link-arrow mt-auto pt-6 text-[0.92rem]" aria-hidden="true">
        Learn more <Icon name="arrow" className="h-4 w-4" />
      </span>
    </article>
  );
}
