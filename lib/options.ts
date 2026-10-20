/** Form option lists shared by client forms and server validation (no zod here, to keep it out of client bundles). */

export const inquiryCategories = [
  "procurement", "contract", "fidic", "mou", "notarial", "documentation", "general",
] as const;

export const timeframes = ["urgent", "within_month", "one_to_three_months", "flexible", "unsure"] as const;

export const timeframeLabels: Record<(typeof timeframes)[number], string> = {
  urgent: "Urgent (deadline within two weeks)",
  within_month: "Within the next month",
  one_to_three_months: "In one to three months",
  flexible: "Flexible",
  unsure: "Not sure yet",
};

export const contactPreferences = ["email", "phone"] as const;
