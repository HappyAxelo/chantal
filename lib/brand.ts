import { site } from "@/content/site";
import { draftPreview } from "@/lib/env";

/**
 * Brand name for the logo, titles and emails. Until an official company name is
 * supplied, production falls back to the owner's (verified) name rather than an
 * invented trading name; draft preview shows the placeholder so it is noticed.
 */
export function brandName(): string {
  if (site.company.displayName) return site.company.displayName;
  if (site.company.name) return site.company.name;
  return draftPreview ? site.company.placeholderName : site.owner.name;
}

/** Full registered name for legal text, copyright and structured data. */
export function legalName(): string {
  return site.company.name ?? brandName();
}

/** Owner name with post-nominals, e.g. "Chantal Nishimwe, FCCM" (only when the credential is confirmed). */
export function ownerDisplayName(): string {
  const { name, postNominals, credential } = site.owner;
  return credential.verified && postNominals ? `${name}, ${postNominals}` : name;
}

/** Owner credential, only when confirmed. */
export function ownerCredential(): string | null {
  return site.owner.credential.verified ? site.owner.credential.value : null;
}

export function publicEmail(): string | null {
  return site.contact.email;
}
