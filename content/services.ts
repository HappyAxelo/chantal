import type { ServiceContent } from "@/types/content";
import { site } from "@/content/site";

/**
 * Service catalogue. Scope items are CANDIDATES drafted from the brief and
 * must be confirmed by the owner (set `scopeConfirmed: true` per service once
 * reviewed). Wording deliberately avoids promising outcomes that depend on a
 * court, regulator, contracting authority or counterparty.
 */
const services: ServiceContent[] = [
  {
    slug: "procurement-advisory",
    category: "procurement",
    title: "Procurement Advisory",
    shortTitle: "Procurement",
    icon: "procurement",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Support in planning, documenting and reviewing procurement processes, for buyers preparing a tender and for bidders responding to one.",
    clientValue: "A procurement file that is coherent, consistent and easier to defend.",
    intro: [
      "Procurement problems are usually documentation problems: requirements that do not match the evaluation criteria, timelines that leave no room for clarifications, or contract terms that arrive too late to be priced properly.",
      "We work alongside your team as an adviser. Decisions, approvals and formal evaluation remain with the people and bodies responsible for them under your rules.",
    ],
    covers: [
      { title: "Procurement planning", text: "Structuring the approach, packaging and timeline for a planned procurement." },
      { title: "Document preparation and review", text: "Reviewing tender and solicitation documents for clarity, internal consistency and completeness." },
      { title: "Bid-side tender review", text: "Helping bidders understand requirements, submission rules and contractual terms before they commit." },
      { title: "Evaluation-process support", text: "Advisory support on evaluation methodology and records, where your rules permit an external adviser." },
      { title: "Process and compliance reviews", text: "Reviewing an existing process against your internal procedures and the rules that apply to you." },
      { title: "Procurement risk identification", text: "Flagging gaps, ambiguities and risks in documents and process before they become disputes." },
    ],
    whoMayNeed: [
      "Organisations planning a tender or request for proposals",
      "Contractors, suppliers and consultants preparing a bid",
      "Project owners and implementing agencies reviewing their procurement files",
      "NGOs and development organisations working to funder procurement rules",
    ],
    problems: [
      "Tender documents with inconsistent requirements or evaluation criteria",
      "Uncertainty about submission requirements and eligibility conditions",
      "Contract conditions in the tender that have not been properly considered",
      "Procurement records that would be difficult to explain if questioned",
    ],
    deliverables: [
      "Written review comments on procurement documents",
      "Procurement plan or timeline outline",
      "Issues and risk log for a specific procurement",
      "Process review note with practical recommendations",
    ],
    process: [
      { title: "Initial consultation", text: "We discuss the procurement, your role in it and the rules that apply." },
      { title: "Scope and terms", text: "We agree what will be reviewed or prepared, the deliverables and the timeline." },
      { title: "Review and drafting", text: "Work is carried out against the agreed scope, with questions raised early." },
      { title: "Handover", text: "You receive written outputs and a walkthrough of the key points." },
    ],
    prepare: [
      "The procurement or tender documents (shared securely once an engagement is agreed)",
      "The procurement rules or policy that apply to you, if known",
      "Key dates, including submission or approval deadlines",
      "A short note of your main concerns",
    ],
    limitations: [
      "We provide advisory support. We do not act as a contracting authority, evaluation committee, auditor or regulator.",
      "We cannot guarantee the award of a contract or the outcome of a complaint or review process.",
      "Support on evaluation is provided only where your procurement rules allow it and conflicts of interest have been checked.",
    ],
    cta: "Discuss Your Procurement Needs",
    seo: {
      title: "Procurement Advisory Services",
      description:
        "Procurement advisory support: planning, tender document review, bid-side review and process reviews. Clear scope, written deliverables.",
    },
  },
  {
    slug: "contract-management",
    category: "contract",
    title: "Contract Management",
    shortTitle: "Contract Management",
    icon: "contract",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Day-to-day contract administration support: obligations, deadlines, variations, correspondence and close-out, kept in order.",
    clientValue: "Fewer missed obligations, better records and earlier sight of contractual risk.",
    intro: [
      "Signing a contract is the start of the work. Value is protected, or lost, in how obligations, notices, changes and payments are administered over the life of the contract.",
      "We help you set up and run a disciplined contract administration routine, scaled to the size of the contract and your team. The precise scope depends on the contract, the project, the applicable law and our engagement terms.",
    ],
    covers: [
      { title: "Contract review for administration", text: "Identifying the obligations, time limits and procedures your team must follow." },
      { title: "Obligations and deadline tracking", text: "Registers and calendars for deliverables, milestones and notice periods." },
      { title: "Variation and change control", text: "Documenting instructions, changes and their agreed or claimed effects." },
      { title: "Correspondence and claims support", text: "Structuring contractual correspondence and supporting the preparation of claim documentation." },
      { title: "Risk registers and reporting", text: "Contract risk registers and progress or compliance reports for management." },
      { title: "Close-out", text: "Final account documentation, outstanding obligations and handover records." },
    ],
    whoMayNeed: [
      "Project owners and employers administering one or more contracts",
      "Contractors and subcontractors managing obligations to a client",
      "Consultants and engineering firms with contract administration duties",
      "Organisations without an in-house contract management function",
    ],
    problems: [
      "Notice periods and time limits missed or at risk",
      "Variations instructed informally and not recorded",
      "Correspondence that does not follow the contract's procedures",
      "No single picture of contractual status for management",
    ],
    deliverables: [
      "Obligations and deadlines register",
      "Contract administration procedure or checklist",
      "Variation and change log",
      "Draft contractual correspondence for your review",
      "Periodic contract status report",
      "Close-out checklist and records",
    ],
    process: [
      { title: "Initial consultation", text: "We discuss the contract, where it stands and what support is needed." },
      { title: "Contract review", text: "We review the contract documents to map obligations and procedures." },
      { title: "Agreed support model", text: "One-off review, set-up of tools, or ongoing administration support." },
      { title: "Delivery and reporting", text: "Work is delivered against the agreed scope with regular check-ins." },
    ],
    prepare: [
      "The signed contract and its key appendices (shared securely once engaged)",
      "Recent correspondence and any notices issued or received",
      "Programme and payment status, if relevant",
      "Your immediate concerns or upcoming deadlines",
    ],
    limitations: [
      "Support is limited to the agreed scope and the documents provided to us.",
      "We cannot guarantee how a counterparty, engineer, adjudicator, arbitrator or court will respond.",
      "Where a matter requires regulated legal advice or representation, we will say so and recommend you seek it.",
    ],
    cta: "Request Contract Management Support",
    seo: {
      title: "Contract Management & Administration Support",
      description:
        "Contract management support: obligations tracking, deadlines, variations, correspondence, risk registers and close-out documentation.",
    },
  },
  {
    slug: "fidic-contract-advisory",
    category: "fidic",
    title: "FIDIC Contract Administration & Advisory",
    shortTitle: "FIDIC Contracts",
    icon: "fidic",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Practical support with the administration of construction and engineering contracts based on FIDIC forms.",
    clientValue: "Procedures followed correctly, records kept properly, and issues raised on time.",
    intro: [
      "FIDIC forms set out detailed procedures for notices, instructions, payment, time, variations and claims. Many disputes arise not from the substance of a disagreement, but from a procedure that was not followed or a record that was never made.",
      "Every FIDIC-based contract is different. The form and edition used, the Particular Conditions, the governing law and any project-specific amendments all change what applies. Our work always starts from your actual contract, not a generic summary.",
    ],
    covers: [
      { title: "Contract administration procedures", text: "Mapping the procedures your contract requires and who is responsible for each." },
      { title: "Roles and responsibilities", text: "Clarifying the roles of the parties and the contract administrator under your contract." },
      { title: "Notices and correspondence", text: "Registers and templates so notices are identified, issued and tracked on time." },
      { title: "Variations and change", text: "Recording instructions, proposals and valuations in line with the contract." },
      { title: "Programme and delay records", text: "Organising the records needed to support or assess time-related entitlements." },
      { title: "Payment and certification", text: "Supporting the preparation and review of payment applications and supporting records." },
      { title: "Claims support", text: "Support with the preparation or assessment of claim documentation." },
      { title: "Dispute avoidance and close-out", text: "Early identification of issues and orderly completion of contractual records." },
    ],
    whoMayNeed: [
      "Employers and project owners using FIDIC-based contracts",
      "Contractors delivering works under FIDIC-based contracts",
      "Engineers and consultants administering FIDIC-based contracts",
      "Implementing agencies on externally financed projects",
    ],
    problems: [
      "Uncertainty about which notices are required and when",
      "Particular Conditions that change the default procedures",
      "Weak contemporary records for delay or variation entitlements",
      "Payment applications or certificates that are repeatedly disputed",
    ],
    deliverables: [
      "Contract procedures map for your specific contract",
      "Notices and time-bar register",
      "Correspondence templates aligned to your contract",
      "Variation and claims log",
      "Review notes on specific contractual issues",
    ],
    process: [
      { title: "Initial consultation", text: "We confirm the form, edition and status of your contract and your role in it." },
      { title: "Contract-specific review", text: "We review the General and Particular Conditions and relevant documents." },
      { title: "Scope and terms", text: "We agree the support required, deliverables and timeline." },
      { title: "Ongoing or one-off support", text: "Delivered as agreed, with clear written outputs." },
    ],
    prepare: [
      "Which FIDIC form and edition the contract is based on",
      "The Particular Conditions and any amendments",
      "The governing law stated in the contract",
      "A short chronology of the issue, if there is one",
    ],
    limitations: [
      "General information on this website is not advice on any specific contract.",
      "We do not reproduce FIDIC publications; you will need your own licensed copy of the relevant form.",
      "This business is not affiliated with or endorsed by FIDIC.",
      "We cannot guarantee the outcome of any claim, determination, adjudication, arbitration or court process.",
    ],
    cta: "Discuss Your FIDIC Contract",
    seo: {
      title: "FIDIC Contract Administration & Advisory",
      description:
        "Support with FIDIC-based contract administration: notices, variations, payment, delay records and claims documentation, based on your actual contract.",
    },
  },
  {
    slug: "mou-drafting-review",
    category: "mou",
    title: "MoU Drafting & Review",
    shortTitle: "MoUs",
    icon: "mou",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Help structuring, drafting and reviewing Memoranda of Understanding so that the collaboration is clearly described.",
    clientValue: "An MoU that says what the parties actually intend, including what is and is not binding.",
    intro: [
      "A Memorandum of Understanding is often signed quickly, at the start of a relationship, and read carefully only when something goes wrong. A clear MoU sets expectations, allocates responsibilities and avoids misunderstandings later.",
      "An MoU's legal effect depends on its wording, its context, the applicable law and the parties' intentions. Some MoUs are intended to be largely non-binding; others contain binding provisions on matters such as confidentiality. Being explicit about this matters.",
    ],
    covers: [
      { title: "Clarifying objectives", text: "Setting out what each party wants the collaboration to achieve." },
      { title: "Structuring the collaboration", text: "Roles, contributions, deliverables and decision-making." },
      { title: "Duration and exit", text: "Commencement, duration, review points and termination." },
      { title: "Confidentiality", text: "Identifying what information needs protection and how." },
      { title: "Governance and communication", text: "Coordination arrangements, focal points and reporting." },
      { title: "Binding and non-binding provisions", text: "Making clear which provisions the parties intend to be legally binding." },
      { title: "Dispute handling", text: "Reviewing how disagreements are to be raised and resolved." },
    ],
    whoMayNeed: [
      "Organisations entering a partnership or collaboration",
      "NGOs and development organisations formalising cooperation",
      "Businesses exploring a joint initiative before a full contract",
      "Institutions reviewing an MoU proposed by another party",
    ],
    problems: [
      "A draft MoU that is vague about who does what",
      "Uncertainty about whether the document creates legal obligations",
      "Missing provisions on confidentiality, duration or exit",
      "A counterparty's draft that needs review before signing",
    ],
    deliverables: [
      "First draft MoU based on agreed key terms",
      "Marked-up review of a draft MoU with comments",
      "Key terms summary for internal approval",
    ],
    process: [
      { title: "Initial consultation", text: "We discuss the parties, the collaboration and the timeline." },
      { title: "Key terms", text: "We agree the main points the MoU needs to record." },
      { title: "Drafting or review", text: "We prepare a draft or review the existing one." },
      { title: "Finalisation", text: "We address comments and prepare a clean version for signature." },
    ],
    prepare: [
      "Names and types of the parties",
      "A summary of the intended collaboration",
      "Any existing draft or template you have been given",
      "Your intended signing date",
    ],
    limitations: [
      "The legal effect of an MoU depends on the applicable law; where formal legal advice is required we will recommend it.",
      "We do not represent you in negotiations with the other party unless this is expressly agreed.",
    ],
    cta: "Request MoU Support",
    seo: {
      title: "MoU Drafting & Review",
      description:
        "Memorandum of Understanding drafting and review: objectives, roles, duration, confidentiality and clarity on which provisions are binding.",
    },
  },
  {
    slug: "notarial-services",
    category: "notarial",
    title: "Private Notarial Services",
    shortTitle: "Notarial Services",
    icon: "notary",
    // DRAFT: activate only after the owner confirms jurisdiction, appointment,
    // qualifications and permitted scope of practice (also set
    // site.features.notarialServices = true).
    status: "draft",
    scopeConfirmed: false,
    summary: "Notarial services by appointment, within the scope permitted by the applicable notarial authorisation.",
    clientValue: "A clear, properly prepared appointment for documents that require notarial formalities.",
    intro: [
      "Notarial acts are regulated. Which documents can be handled, what identification is needed and whether any part of the process can be done remotely all depend on the applicable law and the scope of the notarial appointment.",
      "Notarisation is distinct from drafting a document or witnessing a signature. Before your appointment we will confirm whether the act you need is one we are authorised to perform.",
    ],
    covers: [
      { title: "[To confirm] Types of documents and acts", text: "List only the acts permitted under the confirmed authorisation." },
      { title: "[To confirm] Identification requirements", text: "Accepted identification documents for each signatory." },
      { title: "[To confirm] Original documents", text: "Whether originals are required and in what form." },
    ],
    whoMayNeed: ["[To confirm with owner]"],
    problems: ["[To confirm with owner]"],
    deliverables: ["[To confirm] Notarial act as permitted under applicable law"],
    process: [
      { title: "Ask about the act", text: "Tell us what document or act you need so we can confirm eligibility." },
      { title: "Appointment", text: "We confirm requirements and book an appointment." },
      { title: "Attendance", text: "Attend with the required identification and documents." },
    ],
    prepare: ["[To confirm] Identification", "[To confirm] Original documents"],
    limitations: [
      "Remote notarisation is not offered unless confirmed as legally permitted.",
      "Fees and processing times are confirmed at booking.",
    ],
    cta: "Ask About Notarial Appointments",
    seo: {
      title: "Private Notarial Services",
      description: "Notarial services by appointment within the scope of the applicable notarial authorisation.",
    },
  },
  {
    slug: "legal-documentation-support",
    category: "documentation",
    title: "Legal & Documentation Support",
    shortTitle: "Documentation Support",
    icon: "documents",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Organising, reviewing and preparing business and contract documentation, within a clearly defined and authorised scope.",
    clientValue: "Documents that are organised, consistent and ready for the people who need to rely on them.",
    intro: [
      "Many organisations need help with documentation that sits between administration and formal legal work: assembling contract files, checking documents for consistency, or preparing standard business documents for review.",
      "This service covers general contractual and documentation support. It does not include reserved legal services such as court representation or formal legal opinions.",
    ],
    covers: [
      { title: "Document organisation", text: "Assembling and indexing contract, project and corporate document sets." },
      { title: "Contract document review", text: "Checking contract documents for completeness, consistency and missing attachments." },
      { title: "Business documentation", text: "Preparing or reviewing standard business documents for your approval." },
      { title: "Administrative support", text: "Supporting document workflows, version control and signature packs." },
    ],
    whoMayNeed: [
      "Businesses and entrepreneurs organising their documentation",
      "Project teams assembling contract files",
      "Organisations preparing documents for internal approval",
    ],
    problems: [
      "Contract files that are incomplete or hard to navigate",
      "Several versions of the same document in circulation",
      "Standard documents that are outdated or inconsistent",
    ],
    deliverables: [
      "Indexed document set",
      "Document review notes",
      "Prepared or updated documents for your review",
    ],
    process: [
      { title: "Initial consultation", text: "We discuss the documents involved and what you need." },
      { title: "Scope statement", text: "We confirm in writing what is, and is not, included." },
      { title: "Delivery", text: "Work is completed and handed over with notes." },
    ],
    prepare: ["A list of the documents involved", "The purpose of the documents", "Any deadline you are working to"],
    limitations: [
      "We do not provide court representation, formal legal opinions or other reserved legal services unless the relevant authorisation is confirmed and stated on this website.",
      "Where your matter requires a qualified lawyer, we will tell you.",
    ],
    cta: "Discuss Your Documentation Needs",
    seo: {
      title: "Legal & Documentation Support",
      description:
        "Contract and business documentation support: organising document sets, consistency reviews and preparation of documents for your review.",
    },
  },
];

function isVisible(s: ServiceContent): boolean {
  if (s.category === "notarial") return s.status === "published" && site.features.notarialServices;
  return s.status === "published";
}

/** Services visible to the public. Draft services are never linked. */
export function publicServices(): ServiceContent[] {
  return services.filter(isVisible);
}

export function getPublicService(slug: string): ServiceContent | undefined {
  return publicServices().find((s) => s.slug === slug);
}

export function allServices(): ServiceContent[] {
  return services;
}

/** Categories offered for booking and inquiries (plus "general"). */
export function bookingCategories(): { id: string; label: string }[] {
  const labels: Record<ServiceContent["category"], string> = {
    procurement: "Procurement consultation",
    contract: "Contract management consultation",
    fidic: "FIDIC-related consultation",
    mou: "MoU consultation",
    notarial: "Notarial appointment",
    documentation: "Documentation support consultation",
  };
  return [
    ...publicServices().map((s) => ({ id: s.category, label: labels[s.category] })),
    { id: "general", label: "General consultation" },
  ];
}
