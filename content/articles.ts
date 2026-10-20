import type { ArticleContent } from "@/types/content";
import { site } from "@/content/site";
import { draftPreview } from "@/lib/env";

/**
 * Insights articles. All articles are original drafts and remain `draft`
 * until the owner has reviewed them and set `status: "published"` and a
 * `publishedAt` date. Drafts are visible only in draft preview.
 */
const articles: ArticleContent[] = [
  {
    slug: "preparing-for-a-consultation",
    title: "Preparing for a first consultation: what to bring",
    excerpt:
      "A short, practical checklist so that a first meeting about a procurement or contract matter is focused and useful.",
    category: "Working with us",
    author: site.owner.name,
    status: "draft",
    publishedAt: null,
    updatedAt: "2026-10-20",
    readingMinutes: 4,
    related: ["notices-and-deadlines", "recording-variations"],
    body: [
      { type: "p", text: "A first consultation is most useful when it is spent understanding the problem rather than reconstructing basic facts. A little preparation goes a long way." },
      { type: "h2", text: "Start with a one-page summary" },
      { type: "p", text: "Write down, in plain language, what the matter is about, who the parties are, where things stand today and what decision or deadline is coming up. One page is enough." },
      { type: "h2", text: "Identify the key documents, but do not send them yet" },
      { type: "p", text: "List the documents that matter: the contract or tender documents, any amendments, and the most recent correspondence. Documents should be shared through a secure channel once an engagement has been agreed, not through a general website form." },
      { type: "ul", items: ["The contract or tender documents and their date", "Any amendments, addenda or Particular Conditions", "The last few relevant letters, notices or emails", "Any upcoming deadline or time limit"] },
      { type: "h2", text: "Be clear about what you want from the meeting" },
      { type: "p", text: "Are you looking for a second opinion, help with a specific step, or ongoing support? Knowing this helps define a realistic scope." },
      { type: "note", text: "This article is general information and is not advice on any particular matter." },
    ],
  },
  {
    slug: "notices-and-deadlines",
    title: "Notices and deadlines: why contract administration starts with a calendar",
    excerpt:
      "Many contractual entitlements depend on giving the right notice, in the right form, on time. A simple register prevents avoidable losses.",
    category: "Contract administration",
    author: site.owner.name,
    status: "draft",
    publishedAt: null,
    updatedAt: "2026-10-20",
    readingMinutes: 5,
    related: ["recording-variations", "preparing-for-a-consultation"],
    body: [
      { type: "p", text: "Construction and service contracts commonly require a party to notify the other within a set period when certain events occur. Depending on the contract wording and the applicable law, a late or defective notice can weaken or remove an entitlement." },
      { type: "h2", text: "Read the contract for procedure, not only substance" },
      { type: "p", text: "When a contract is signed, attention tends to focus on price, scope and programme. It is equally important to extract the procedures: who must give notice, to whom, in what form, by what method and within what period." },
      { type: "h2", text: "Build a notices register" },
      { type: "ul", items: ["The clause and the triggering event", "The period allowed and how it is counted", "The required form and addressee", "The date the event became known", "The date notice was given and how"] },
      { type: "h2", text: "Check amendments" },
      { type: "p", text: "Standard forms are frequently amended. Particular or special conditions can shorten periods, change addressees or add requirements. The register should reflect the contract as signed, not the standard form." },
      { type: "note", text: "This article is general information and is not advice on any specific contract. Time limits and their effect depend on the contract wording and the applicable law." },
    ],
  },
  {
    slug: "recording-variations",
    title: "Managing contract variations: a record-keeping approach",
    excerpt:
      "Variations are a normal part of most projects. Problems usually come from how they were instructed and recorded, not from the change itself.",
    category: "Contract administration",
    author: site.owner.name,
    status: "draft",
    publishedAt: null,
    updatedAt: "2026-10-20",
    readingMinutes: 5,
    related: ["notices-and-deadlines", "mou-binding-provisions"],
    body: [
      { type: "p", text: "Most contracts allow the scope of work to be changed. The contract will usually say who may instruct a change, how it must be instructed and how its effect on price and time is to be assessed." },
      { type: "h2", text: "Keep instruction and valuation separate" },
      { type: "p", text: "Record the instruction first: who gave it, when, in what form and what exactly was changed. Valuation and time effects can follow, but disputes are harder to resolve if the instruction itself is unclear." },
      { type: "h2", text: "A simple variation log" },
      { type: "ul", items: ["Reference number and date", "Source and form of the instruction", "Description of the change", "Notices given and received", "Proposed and agreed effect on price and time", "Current status"] },
      { type: "h2", text: "Make informal instructions formal" },
      { type: "p", text: "Site meetings and phone calls often produce informal instructions. Where the contract requires a written instruction, confirming it in writing promptly protects both parties." },
      { type: "note", text: "This article is general information and is not advice on any particular contract." },
    ],
  },
  {
    slug: "mou-binding-provisions",
    title: "MoUs: being clear about what is binding",
    excerpt:
      "An MoU can be a useful first step in a collaboration. It works best when the parties are explicit about which commitments they intend to be legally binding.",
    category: "MoUs",
    author: site.owner.name,
    status: "draft",
    publishedAt: null,
    updatedAt: "2026-10-20",
    readingMinutes: 4,
    related: ["preparing-for-a-consultation"],
    body: [
      { type: "p", text: "Memoranda of Understanding are widely used to record the intention to cooperate. Their legal effect is not determined by the title. It depends on the wording, the context, the applicable law and what the parties intended." },
      { type: "h2", text: "Say what you mean" },
      { type: "p", text: "If the parties do not intend most of the MoU to create legal obligations, that should be stated. If some provisions, such as confidentiality, are intended to be binding, those should be identified clearly." },
      { type: "h2", text: "Points worth covering" },
      { type: "ul", items: ["The purpose and scope of the collaboration", "Each party's role and contribution", "Duration, review and termination", "Confidentiality and use of information", "Coordination and focal points", "How disagreements will be handled"] },
      { type: "note", text: "This article is general information. Where the legal effect of an MoU matters, seek advice on the applicable law." },
    ],
  },
];

export function visibleArticles(): ArticleContent[] {
  return articles
    .filter((a) => a.status === "published" || draftPreview)
    .sort((a, b) => (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt));
}

export function getVisibleArticle(slug: string): ArticleContent | undefined {
  return visibleArticles().find((a) => a.slug === slug);
}

/** Insights is linked only when enabled and there is something to read. */
export function insightsEnabled(): boolean {
  return site.features.insights && visibleArticles().length > 0;
}

export function allArticles(): ArticleContent[] {
  return articles;
}
