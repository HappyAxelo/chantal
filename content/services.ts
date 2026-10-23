import type { ServiceCategory, ServiceContent } from "@/types/content";
import { site } from "@/content/site";

/**
 * Service catalogue, in the order and with the scope items set out in the
 * owner's comments on "Our Services" (2026-10-23). The short explanatory text
 * under each scope item is drafted and must be confirmed by the owner (set
 * `scopeConfirmed: true` per service once reviewed). Wording deliberately
 * avoids promising outcomes that depend on a court, regulator, contracting
 * authority or counterparty.
 */
const services: ServiceContent[] = [
  {
    slug: "fidic-contract-advisory",
    category: "fidic",
    title: "FIDIC Contract Administration & Advisory",
    shortTitle: "FIDIC Contracts",
    icon: "fidic",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Practical support with the administration of Red Book and Yellow Book contracts: notices, time limits, variations, payment and contractual risk.",
    clientValue: "Procedures followed correctly, records kept properly, and issues raised on time.",
    intro: [
      "FIDIC forms set out detailed procedures for notices, instructions, payment, time, variations and claims. Many disputes arise not from the substance of a disagreement, but from a procedure that was not followed or a record that was never made.",
      `This service is led by ${site.owner.name}, a ${site.owner.credential.value}. Every FIDIC-based contract is different: the form and edition used, the Particular Conditions, the governing law and any project-specific amendments all change what applies. Our work always starts from your actual contract, not a generic summary.`,
    ],
    covers: [
      { title: "Red Book and Yellow Book administration", text: "Contract administration support under the Conditions of Contract for Construction and for Plant and Design-Build." },
      { title: "Notices, claims and time limits", text: "Identifying the notices your contract requires, who must give them and the time limits that apply." },
      { title: "Extension of Time and variations", text: "Support with EOT entitlements, variation instructions, proposals and their supporting records." },
      { title: "Payment procedures and obligations", text: "Interim and final payment procedures, certification and the obligations that sit around them." },
      { title: "Contractual risk and dispute avoidance", text: "Early identification of contractual risk, and steps that keep disagreements from becoming disputes." },
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
      "Variation and EOT log",
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
      "FCCM is an individual certification; this business is not otherwise affiliated with or endorsed by FIDIC.",
      "We cannot guarantee the outcome of any claim, determination, adjudication, arbitration or court process.",
    ],
    cta: "Discuss Your FIDIC Contract",
    related: ["claims-variations-dispute-avoidance", "contract-management", "quantity-surveying-cost-management"],
    seo: {
      title: "FIDIC Contract Administration & Advisory",
      description:
        "FIDIC Red Book and Yellow Book contract administration: notices, time limits, Extension of Time, variations, payment and dispute avoidance. Led by an FCCM.",
    },
  },
  {
    slug: "quantity-surveying-cost-management",
    category: "quantity_surveying",
    title: "Quantity Surveying & Cost Management",
    shortTitle: "Quantity Surveying",
    icon: "quantity",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Measurement, estimating, valuation and cost control, from Bills of Quantities through interim payments to the final account.",
    clientValue: "Costs that are measured, valued and reconciled on a basis everyone can follow.",
    intro: [
      "Cost certainty on a project depends on careful measurement at the start and disciplined valuation throughout. Errors in a Bill of Quantities, or variations valued informally, tend to surface late, when they are hardest to resolve.",
      "We support the commercial side of your project at each stage, working from the drawings, specifications and contract that actually apply.",
    ],
    covers: [
      { title: "Bills of Quantities", text: "Preparation and review of BoQs for completeness, consistency and measurability." },
      { title: "Cost estimation and budgeting", text: "Estimates and budgets that set out their basis and assumptions." },
      { title: "Quantity take-offs and measurement", text: "Measurement from drawings and on site, to an agreed method of measurement." },
      { title: "Interim payment valuation", text: "Valuation and assessment support for interim payment applications." },
      { title: "Variation valuation and cost control", text: "Valuing variations in line with the contract and tracking their effect on cost." },
      { title: "Final account", text: "Preparation and reconciliation of the final account." },
      { title: "Tender pricing and commercial evaluation", text: "Reviewing tender prices and the commercial terms behind them." },
    ],
    whoMayNeed: [
      "Employers and project owners who need independent cost control",
      "Contractors and subcontractors preparing valuations or final accounts",
      "Consultants who need quantity surveying support on a project",
      "Organisations evaluating tender prices",
    ],
    problems: [
      "Bills of Quantities that do not reflect the drawings or specifications",
      "Interim payments that are repeatedly disputed or delayed",
      "Variations instructed but never valued or agreed",
      "A final account that cannot be reconciled",
    ],
    deliverables: [
      "Prepared or reviewed Bill of Quantities",
      "Cost estimate or budget with stated assumptions",
      "Interim valuation or assessment report",
      "Variation valuation schedule",
      "Final account statement and reconciliation",
      "Tender pricing review note",
    ],
    process: [
      { title: "Initial consultation", text: "We discuss the project, its stage and the commercial support needed." },
      { title: "Document review", text: "We review the drawings, specifications, contract and pricing documents." },
      { title: "Scope and terms", text: "We agree the deliverables, method of measurement and timeline." },
      { title: "Delivery", text: "Measured and valued outputs, with a walkthrough of the key figures." },
    ],
    prepare: [
      "Drawings and specifications (shared securely once engaged)",
      "The contract or tender documents, including any priced BoQ",
      "Payment and variation records to date, if relevant",
      "Key dates, including valuation or submission deadlines",
    ],
    limitations: [
      "Outputs depend on the completeness and accuracy of the information provided.",
      "Estimates are professional assessments, not guarantees of final cost.",
      "Agreement of valuations and final accounts rests with the parties and the contract administrator under your contract.",
    ],
    cta: "Discuss Your Cost Management Needs",
    related: ["claims-variations-dispute-avoidance", "fidic-contract-advisory", "procurement-advisory"],
    seo: {
      title: "Quantity Surveying & Cost Management",
      description:
        "Quantity surveying support: Bills of Quantities, estimating, take-offs, interim valuations, variation valuation, final accounts and tender pricing review.",
    },
  },
  {
    slug: "contract-management",
    category: "contract",
    title: "Contract Management & Administration",
    shortTitle: "Contract Management",
    icon: "contract",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Contract review, drafting support and day-to-day administration: obligations, deadlines, notices, variations, payment and close-out, kept in order.",
    clientValue: "Fewer missed obligations, better records and earlier sight of contractual risk.",
    intro: [
      "Signing a contract is the start of the work. Value is protected, or lost, in how obligations, notices, changes and payments are administered over the life of the contract.",
      "We help you review and negotiate contracts before they are signed, then set up and run a disciplined administration routine scaled to the size of the contract and your team. The precise scope depends on the contract, the project, the applicable law and our engagement terms.",
    ],
    covers: [
      { title: "Contract review and risk assessment", text: "Reading the contract for what it requires and where the risk sits." },
      { title: "Drafting, review and negotiation support", text: "Support preparing, reviewing and negotiating contract terms." },
      { title: "Obligations and deadline registers", text: "Registers and calendars for deliverables, milestones and notice periods." },
      { title: "Contract notices and correspondence", text: "Structuring contractual correspondence so it follows the contract's procedures." },
      { title: "Variation, payment and close-out administration", text: "Administering changes, payments and the orderly completion of the contract." },
    ],
    whoMayNeed: [
      "Project owners and employers administering one or more contracts",
      "Contractors and subcontractors managing obligations to a client",
      "Consultants and engineering firms with contract administration duties",
      "Organisations without an in-house contract management function",
    ],
    problems: [
      "Contract terms signed without a clear view of the risk they carry",
      "Notice periods and time limits missed or at risk",
      "Variations instructed informally and not recorded",
      "No single picture of contractual status for management",
    ],
    deliverables: [
      "Contract review and risk summary",
      "Marked-up draft with negotiation points",
      "Obligations and deadlines register",
      "Draft contractual correspondence for your review",
      "Periodic contract status report",
      "Close-out checklist and records",
    ],
    process: [
      { title: "Initial consultation", text: "We discuss the contract, where it stands and what support is needed." },
      { title: "Contract review", text: "We review the contract documents to map obligations, risk and procedures." },
      { title: "Agreed support model", text: "One-off review, set-up of tools, or ongoing administration support." },
      { title: "Delivery and reporting", text: "Work is delivered against the agreed scope with regular check-ins." },
    ],
    prepare: [
      "The contract or draft and its key appendices (shared securely once engaged)",
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
    related: ["fidic-contract-advisory", "commercial-agreements-documentation", "claims-variations-dispute-avoidance"],
    seo: {
      title: "Contract Management & Administration",
      description:
        "Contract management support: contract review and risk assessment, drafting and negotiation support, deadline registers, notices, variations, payment and close-out.",
    },
  },
  {
    slug: "claims-variations-dispute-avoidance",
    category: "claims",
    title: "Claims, Variations & Dispute Avoidance",
    shortTitle: "Claims & Variations",
    icon: "claims",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Preparing, substantiating and reviewing claims and variations, combining contractual procedure with quantity surveying.",
    clientValue: "Claims that are organised, evidenced and presented in line with the contract.",
    intro: [
      "A claim succeeds or fails on its records. Entitlement has to be shown under the contract, the effect on time and cost has to be demonstrated, and the procedure has to have been followed.",
      "This service brings contract administration and quantity surveying together, so that the contractual basis of a claim and its valuation are prepared consistently. The aim throughout is to resolve matters early and, where that is not possible, to be well prepared.",
    ],
    covers: [
      { title: "Claims documentation and substantiation", text: "Assembling the contractual basis, chronology and evidence a claim relies on." },
      { title: "EOT claim preparation", text: "Support preparing Extension of Time claims and their supporting records." },
      { title: "Delay and prolongation costs", text: "Support with delay-related cost and prolongation claims." },
      { title: "Variation and change-order assessment", text: "Assessing whether a change is a variation and what its effect is." },
      { title: "Claim reviews and evidence organisation", text: "Reviewing claims received or prepared, and organising the evidence behind them." },
      { title: "Dispute avoidance and preparation", text: "Steps to resolve issues early, and preparation should a matter go to dispute resolution." },
    ],
    whoMayNeed: [
      "Contractors and subcontractors with time or cost entitlements to pursue",
      "Employers and project owners assessing claims received",
      "Engineers and consultants who must determine or advise on claims",
      "Parties preparing for adjudication, arbitration or other dispute resolution",
    ],
    problems: [
      "Delay or disruption without the records needed to demonstrate it",
      "Variations instructed but disputed as to whether they are variations at all",
      "A claim submitted without a clear link between cause, effect and cost",
      "A large volume of project records with no structure",
    ],
    deliverables: [
      "Claim document or claim review report",
      "Chronology and evidence index",
      "Variation assessment schedule",
      "Prolongation cost calculation support",
      "Issues note with recommended next steps",
    ],
    process: [
      { title: "Initial consultation", text: "We discuss the issue, the contract and the stage the matter has reached." },
      { title: "Records review", text: "We review the contract, notices, programmes and cost records available." },
      { title: "Scope and terms", text: "We agree what will be prepared or reviewed, and by when." },
      { title: "Preparation and handover", text: "Written outputs delivered with a walkthrough of strengths and gaps." },
    ],
    prepare: [
      "The contract, including the Particular Conditions",
      "Notices given or received and the related correspondence",
      "Programmes and progress records",
      "A short chronology of events",
    ],
    limitations: [
      "We cannot guarantee the outcome of any claim, determination, adjudication, arbitration or court process.",
      "We do not provide legal representation in dispute proceedings unless expressly confirmed.",
      "The strength of a claim depends on the records available; we will tell you where they are weak.",
    ],
    cta: "Discuss Your Claim or Variation",
    related: ["fidic-contract-advisory", "quantity-surveying-cost-management", "contract-management"],
    seo: {
      title: "Claims, Variations & Dispute Avoidance",
      description:
        "Claims and variations support: claim substantiation, EOT and prolongation claims, variation assessment, claim reviews and dispute avoidance.",
    },
  },
  {
    slug: "procurement-advisory",
    category: "procurement",
    title: "Procurement Advisory",
    shortTitle: "Procurement",
    icon: "procurement",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Procurement strategy, tender documentation, evaluation support and compliance reviews, for buyers and for bidders.",
    clientValue: "A procurement file that is coherent, consistent and easier to defend.",
    intro: [
      "Procurement problems are usually documentation problems: requirements that do not match the evaluation criteria, timelines that leave no room for clarifications, or contract terms that arrive too late to be priced properly.",
      "We work alongside your team as an adviser. Decisions, approvals and formal evaluation remain with the people and bodies responsible for them under your rules.",
    ],
    covers: [
      { title: "Strategy, policies and procedures", text: "Procurement strategy, and the policies and procedures that support it." },
      { title: "Tender and RFQ/RFP documentation", text: "Preparing and reviewing tender, RFQ and RFP documents for clarity and consistency." },
      { title: "Evaluation and negotiation support", text: "Support with tender evaluation and negotiation, where your rules permit an external adviser." },
      { title: "Compliance and process reviews", text: "Reviewing a process against your procedures and the rules that apply to you." },
      { title: "Supplier and subcontractor performance", text: "Setting up and running performance management for suppliers and subcontractors." },
    ],
    whoMayNeed: [
      "Organisations planning a tender or request for proposals",
      "Contractors, suppliers and consultants preparing a bid",
      "Project owners and implementing agencies reviewing their procurement files",
      "NGOs and development organisations working to funder procurement rules",
    ],
    problems: [
      "Tender documents with inconsistent requirements or evaluation criteria",
      "No written procurement procedure, or one that is not followed",
      "Procurement records that would be difficult to explain if questioned",
      "Supplier or subcontractor performance that is not measured",
    ],
    deliverables: [
      "Procurement strategy or procedure document",
      "Prepared or reviewed tender, RFQ or RFP documents",
      "Evaluation methodology and records support",
      "Compliance review note with practical recommendations",
      "Supplier performance framework",
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
    related: ["policy-procedures-governance", "quantity-surveying-cost-management", "commercial-agreements-documentation"],
    seo: {
      title: "Procurement Advisory Services",
      description:
        "Procurement advisory: strategy and procedures, tender and RFQ/RFP documentation, evaluation and negotiation support, compliance reviews and supplier performance.",
    },
  },
  {
    slug: "policy-procedures-governance",
    category: "governance",
    title: "Policy, Procedures & Governance Advisory",
    shortTitle: "Policy & Governance",
    icon: "governance",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Developing and reviewing the policies, procedures and approval frameworks that govern how procurement and contracts are run.",
    clientValue: "Clear rules on who decides what, written down and followed in practice.",
    intro: [
      "Good contract and procurement outcomes depend on the framework around them: who can approve what, which steps are mandatory, and how decisions are recorded. Where that framework is missing or out of date, the same problems repeat from project to project.",
      "We help organisations put practical policies and procedures in place, proportionate to their size and the rules they work under.",
    ],
    // DRAFT scope: the owner's comments list this service without scope items.
    // The items below are candidates for the owner to confirm or replace.
    covers: [
      { title: "Policy development and review", text: "Drafting or updating procurement and contract management policies." },
      { title: "Standard operating procedures", text: "Step-by-step procedures, workflows and checklists for your team." },
      { title: "Approval and delegation frameworks", text: "Clear authority levels for approvals, commitments and changes." },
      { title: "Compliance reviews", text: "Reviewing how procedures are applied in practice against your policies and the rules that apply." },
      { title: "Templates and records", text: "Standard forms and record-keeping that support the procedures." },
    ],
    whoMayNeed: [
      "Organisations formalising procurement or contract management for the first time",
      "Institutions updating policies to reflect new rules or funder requirements",
      "Growing businesses whose informal processes no longer scale",
      "NGOs and development organisations preparing for audits or reviews",
    ],
    problems: [
      "Procedures that exist on paper but are not followed",
      "Unclear authority for approving contracts and changes",
      "Policies that no longer reflect the rules that apply",
      "Inconsistent practice from one project or department to the next",
    ],
    deliverables: [
      "Policy document or marked-up review of an existing policy",
      "Standard operating procedures and checklists",
      "Approval and delegation matrix",
      "Compliance review note with recommendations",
    ],
    process: [
      { title: "Initial consultation", text: "We discuss your organisation, its current framework and what prompted the review." },
      { title: "Review of existing documents", text: "We review current policies, procedures and the rules that apply to you." },
      { title: "Drafting", text: "We prepare or revise documents for your review." },
      { title: "Finalisation and handover", text: "We address comments and walk your team through the final documents." },
    ],
    prepare: [
      "Existing policies and procedures, if any",
      "The external rules or funder requirements that apply to you",
      "An outline of your organisation's structure and approval levels",
      "Any audit or review findings you need to address",
    ],
    limitations: [
      "Policies and procedures are adopted by your organisation; approval remains with your governing bodies.",
      "We do not act as an auditor or regulator.",
      "Where a policy requires formal legal advice on the applicable law, we will recommend it.",
    ],
    cta: "Discuss Your Policies and Procedures",
    related: ["procurement-advisory", "contract-management", "training-professional-development"],
    seo: {
      title: "Policy, Procedures & Governance Advisory",
      description:
        "Policy, procedures and governance advisory for procurement and contract management: policies, SOPs, approval frameworks and compliance reviews.",
    },
  },
  {
    slug: "commercial-agreements-documentation",
    category: "documentation",
    title: "Commercial Agreements & Documentation Support",
    shortTitle: "Commercial Agreements",
    icon: "mou",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Preparing and reviewing MoUs, subcontracts, consultancy agreements, amendments, letters and the registers that keep them in order.",
    clientValue: "Agreements that say what the parties intend, with records that are complete and easy to find.",
    intro: [
      "Commercial documents are often prepared quickly and read carefully only when something goes wrong. A clear MoU, subcontract or letter of award sets expectations, allocates responsibilities and avoids misunderstandings later.",
      "This service covers contractual and commercial documentation support. The legal effect of any document depends on its wording, its context and the applicable law; this service does not include reserved legal services such as court representation or formal legal opinions.",
    ],
    covers: [
      { title: "Memoranda of Understanding", text: "Structuring, drafting and reviewing MoUs, including which provisions are intended to be binding." },
      { title: "Subcontract and consultancy agreements", text: "Preparing and reviewing subcontract and consultancy agreement documentation." },
      { title: "Amendments and addenda", text: "Drafting contract amendments and addenda that fit the original agreement." },
      { title: "Letters and contractual notices", text: "Letters of intent, letters of award and contractual notices." },
      { title: "Registers and document control", text: "Contract registers and document-control systems." },
      { title: "Completion and close-out", text: "Contract completion and close-out documentation." },
    ],
    whoMayNeed: [
      "Organisations entering a partnership, collaboration or subcontract",
      "Contractors and consultants appointing subcontractors or sub-consultants",
      "Project teams that need amendments, letters or notices prepared",
      "Organisations whose contract files are incomplete or hard to navigate",
    ],
    problems: [
      "A draft MoU or agreement that is vague about who does what",
      "Uncertainty about whether a document creates legal obligations",
      "Amendments that conflict with the original contract",
      "Several versions of the same document in circulation",
    ],
    deliverables: [
      "First draft agreement or MoU based on agreed key terms",
      "Marked-up review of a draft with comments",
      "Draft letters, notices, amendments or addenda for your review",
      "Contract register and document-control set-up",
      "Close-out document set",
    ],
    process: [
      { title: "Initial consultation", text: "We discuss the parties, the documents involved and the timeline." },
      { title: "Key terms", text: "We agree the main points the document needs to record." },
      { title: "Drafting or review", text: "We prepare a draft or review the existing one." },
      { title: "Finalisation", text: "We address comments and prepare a clean version for signature." },
    ],
    prepare: [
      "Names and types of the parties",
      "A summary of the arrangement or the change required",
      "Any existing draft, template or underlying contract",
      "Your intended signing or issue date",
    ],
    limitations: [
      "We do not provide court representation, formal legal opinions or other reserved legal services unless the relevant authorisation is confirmed and stated on this website.",
      "We do not represent you in negotiations with the other party unless this is expressly agreed.",
      "Where your matter requires a qualified lawyer, we will tell you.",
    ],
    cta: "Discuss Your Agreements and Documents",
    related: ["contract-management", "procurement-advisory", "policy-procedures-governance"],
    seo: {
      title: "Commercial Agreements & Documentation Support",
      description:
        "MoUs, subcontract and consultancy agreements, amendments and addenda, letters of intent and award, contract registers and close-out documentation.",
    },
  },
  {
    slug: "training-professional-development",
    category: "training",
    title: "Training & Professional Development",
    shortTitle: "Training",
    icon: "training",
    status: "published",
    scopeConfirmed: false,
    summary:
      "Practical workshops and in-house training on FIDIC contract administration, procurement, contract risk and quantity surveying.",
    clientValue: "Teams that understand the procedures they are expected to follow, and why they matter.",
    intro: [
      "Most contractual problems start with people who were never shown what the contract or procedure requires of them. Training closes that gap before it becomes costly.",
      "Sessions are practical and built around the documents your team actually uses. They can be delivered as stand-alone workshops or tailored in-house programmes for a project team.",
    ],
    covers: [
      { title: "FIDIC contract administration workshops", text: "Notices, time limits, variations, payment and claims under FIDIC-based contracts." },
      { title: "Procurement and tender management", text: "Planning, documenting and running a procurement from start to finish." },
      { title: "Contract risk and compliance", text: "Recognising contractual risk and keeping procedures and records compliant." },
      { title: "Quantity surveying and commercial management", text: "Workshops delivered jointly with a quantity surveying colleague." },
      { title: "Tailored in-house training", text: "Programmes built around your project team, contracts and procedures." },
    ],
    whoMayNeed: [
      "Project and contract management teams",
      "Procurement units and tender committees",
      "Contractors' commercial and site teams",
      "Organisations onboarding staff to FIDIC-based projects",
    ],
    problems: [
      "Notices and procedures missed because the team does not know they apply",
      "New staff joining a live project without contract training",
      "Inconsistent procurement practice across departments",
      "Generic courses that do not reflect your contracts",
    ],
    deliverables: [
      "Workshop delivery, in person or online",
      "Training materials and practical exercises",
      "Quick-reference guides for your team",
      "Short follow-up session to answer questions",
    ],
    process: [
      { title: "Initial consultation", text: "We discuss your team, their roles and what they need to be able to do." },
      { title: "Programme design", text: "We agree topics, format, duration and any case material." },
      { title: "Delivery", text: "Sessions delivered as agreed, with practical exercises." },
      { title: "Follow-up", text: "Materials handed over and questions answered after the session." },
    ],
    prepare: [
      "The number of participants and their roles",
      "The contracts or procedures the team works with",
      "Preferred format, location and dates",
      "Any specific issues you want the training to address",
    ],
    limitations: [
      "Training provides general guidance and is not advice on any specific contract or matter.",
      "Training materials do not reproduce FIDIC publications; participants should use licensed copies.",
    ],
    cta: "Plan a Training Session",
    related: ["fidic-contract-advisory", "procurement-advisory", "policy-procedures-governance"],
    seo: {
      title: "Training & Professional Development",
      description:
        "FIDIC contract administration workshops, procurement and tender management training, contract risk and compliance, and tailored in-house training.",
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
    related: ["commercial-agreements-documentation"],
    seo: {
      title: "Private Notarial Services",
      description: "Notarial services by appointment within the scope of the applicable notarial authorisation.",
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

/** Published services listed in `s.related`, falling back to the next services in the catalogue. */
export function relatedServices(s: ServiceContent, count = 3): ServiceContent[] {
  const pub = publicServices().filter((o) => o.slug !== s.slug);
  const picked = s.related.map((slug) => pub.find((o) => o.slug === slug)).filter((o): o is ServiceContent => !!o);
  for (const o of pub) if (picked.length < count && !picked.includes(o)) picked.push(o);
  return picked.slice(0, count);
}

const categoryLabels: Record<ServiceCategory, string> = {
  fidic: "FIDIC contract consultation",
  quantity_surveying: "Quantity surveying & cost consultation",
  contract: "Contract management consultation",
  claims: "Claims & variations consultation",
  procurement: "Procurement consultation",
  governance: "Policy & governance consultation",
  documentation: "Commercial agreements & documentation consultation",
  training: "Training inquiry",
  notarial: "Notarial appointment",
};

/** Categories offered for booking and inquiries (plus "general"). */
export function bookingCategories(): { id: string; label: string }[] {
  return [
    ...publicServices().map((s) => ({ id: s.category, label: categoryLabels[s.category] })),
    { id: "general", label: "General consultation" },
  ];
}
