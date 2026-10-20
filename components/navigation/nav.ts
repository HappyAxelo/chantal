import { insightsEnabled } from "@/content/articles";
import { publicServices } from "@/content/services";

export interface NavItem {
  label: string;
  href: string;
}

export function navigation() {
  const services: NavItem[] = publicServices().map((s) => ({ label: s.title, href: `/services/${s.slug}` }));
  const main: NavItem[] = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    ...(insightsEnabled() ? [{ label: "Insights", href: "/insights" }] : []),
    { label: "Contact", href: "/contact" },
  ];
  return { main, services };
}
