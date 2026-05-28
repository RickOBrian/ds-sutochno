export type CalloutVariant = "note" | "warning" | "info";

export interface RedPolicyHero {
  title: string;
  subtitle?: string;
  description?: string;
}

export interface RedPolicySectionHeading {
  type: "section";
  id: string;
  title: string;
  level: 1 | 2 | 3;
}

export interface RedPolicyParagraph {
  type: "paragraph";
  text: string;
}

export interface RedPolicyList {
  type: "bulletList" | "numberedList";
  items: string[];
}

export interface RedPolicyQuote {
  type: "quote";
  text: string;
}

export interface RedPolicyCallout {
  type: "callout";
  variant: CalloutVariant;
  title?: string;
  text: string;
}

export interface RedPolicyDoDont {
  type: "doDont";
  dont: string[];
  do: string[];
}

export interface RedPolicyExample {
  type: "example";
  title?: string;
  text: string;
}

export type RedPolicyBlock =
  | RedPolicySectionHeading
  | RedPolicyParagraph
  | RedPolicyList
  | RedPolicyQuote
  | RedPolicyCallout
  | RedPolicyDoDont
  | RedPolicyExample;

export interface RedPolicyDocument {
  hero: RedPolicyHero;
  blocks: RedPolicyBlock[];
  /** Разделы для навигации (h1 / h2) */
  sections: { id: string; title: string; level: 1 | 2 }[];
}
