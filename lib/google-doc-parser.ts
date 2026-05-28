import type {
  CalloutVariant,
  RedPolicyBlock,
  RedPolicyDocument,
  RedPolicyHero,
} from "@/types/red-policy";

const BLOCK_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "ul",
  "ol",
  "table",
  "blockquote",
] as const;

type BlockTag = (typeof BLOCK_TAGS)[number];

interface RawElement {
  tag: BlockTag;
  attrs: string;
  html: string;
}

const CALLOUT_MARKERS: { pattern: RegExp; variant: CalloutVariant; title: string }[] = [
  { pattern: /^NOTE:\s*/i, variant: "note", title: "Примечание" },
  { pattern: /^WARNING:\s*/i, variant: "warning", title: "Важно" },
  { pattern: /^ВАЖНО:\s*/i, variant: "warning", title: "Важно" },
  { pattern: /^ПРИМЕЧАНИЕ:\s*/i, variant: "note", title: "Примечание" },
  { pattern: /^INFO:\s*/i, variant: "info", title: "Инфо" },
];

const EXAMPLE_PATTERN = /^EXAMPLE:\s*/i;

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»");
}

export function stripHtmlToText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/li>\s*<li[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return base || "section";
}

function extractContentsHtml(documentHtml: string): string {
  const match = documentHtml.match(/<div id="contents">([\s\S]*)/i);
  if (!match) return documentHtml;

  let inner = match[1];
  const bodyEnd = inner.lastIndexOf("</body>");
  if (bodyEnd !== -1) inner = inner.slice(0, bodyEnd);

  return inner
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");
}

function extractElement(
  html: string,
  startIndex: number,
  tagName: string,
): { html: string; endIndex: number } | null {
  const slice = html.slice(startIndex);
  const openMatch = slice.match(new RegExp(`^<${tagName}\\b[^>]*>`, "i"));
  if (!openMatch) return null;

  const tagRe = new RegExp(`<(\\/?)${tagName}\\b[^>]*>`, "gi");
  tagRe.lastIndex = startIndex;

  let depth = 0;
  let lastIndex = startIndex;

  for (const match of html.matchAll(tagRe)) {
    if (match.index === undefined) continue;
    if (match[1]) depth--;
    else depth++;
    lastIndex = match.index + match[0].length;
    if (depth === 0) {
      return {
        html: html.slice(startIndex, lastIndex),
        endIndex: lastIndex,
      };
    }
  }

  return null;
}

function findNextBlockTag(
  html: string,
  fromIndex: number,
): { tag: BlockTag; index: number } | null {
  let earliest: { tag: BlockTag; index: number } | null = null;

  for (const tag of BLOCK_TAGS) {
    const re = new RegExp(`<${tag}\\b`, "i");
    const match = re.exec(html.slice(fromIndex));
    if (!match) continue;
    const index = fromIndex + match.index;
    if (!earliest || index < earliest.index) {
      earliest = { tag, index };
    }
  }

  return earliest;
}

function extractRawElements(html: string): RawElement[] {
  const elements: RawElement[] = [];
  let pos = 0;

  while (pos < html.length) {
    const next = findNextBlockTag(html, pos);
    if (!next) break;

    if (next.index > pos) {
      pos = next.index;
    }

    const extracted = extractElement(html, next.index, next.tag);
    if (!extracted) {
      pos = next.index + 1;
      continue;
    }

    const openMatch = extracted.html.match(new RegExp(`^<${next.tag}\\b([^>]*)>`, "i"));
    elements.push({
      tag: next.tag,
      attrs: openMatch?.[1] ?? "",
      html: extracted.html,
    });
    pos = extracted.endIndex;
  }

  return elements;
}

function parseCallout(text: string): RedPolicyBlock | null {
  for (const marker of CALLOUT_MARKERS) {
    if (marker.pattern.test(text)) {
      return {
        type: "callout",
        variant: marker.variant,
        title: marker.title,
        text: text.replace(marker.pattern, "").trim(),
      };
    }
  }
  return null;
}

function parseExample(text: string): RedPolicyBlock | null {
  if (!EXAMPLE_PATTERN.test(text)) return null;
  return {
    type: "example",
    title: "Пример",
    text: text.replace(EXAMPLE_PATTERN, "").trim(),
  };
}

function extractTableCells(rowHtml: string): string[] {
  return [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)]
    .map((m) => stripHtmlToText(m[1]))
    .filter((cell) => cell.length > 0);
}

function parseComparisonTable(tableHtml: string): RedPolicyBlock | null {
  const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  if (rows.length < 2) return null;

  const header = extractTableCells(rows[0][1]);
  const dontCol = header.findIndex((c) => /неправильно/i.test(c));
  const doCol = header.findIndex((c) => /^правильно$/i.test(c.trim()));

  if (dontCol === -1 || doCol === -1) return null;

  const dont: string[] = [];
  const doItems: string[] = [];

  for (let i = 1; i < rows.length; i++) {
    const fullCells = [...rows[i][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) =>
      stripHtmlToText(m[1]),
    );
    const wrong = fullCells[dontCol]?.trim();
    const right = fullCells[doCol]?.trim();
    if (wrong) dont.push(wrong);
    if (right) doItems.push(right);
  }

  if (dont.length === 0 && doItems.length === 0) return null;

  return { type: "doDont", dont, do: doItems };
}

function parseDoDontFromParagraphs(
  wrongText: string,
  rightText: string,
): RedPolicyBlock | null {
  if (!wrongText.trim() || !rightText.trim()) return null;
  return {
    type: "doDont",
    dont: [wrongText.trim()],
    do: [rightText.trim()],
  };
}

function parseHeading(
  tag: BlockTag,
  attrs: string,
  innerHtml: string,
): RedPolicyBlock | null {
  const level = Math.min(parseInt(tag[1], 10), 3) as 1 | 2 | 3;
  const rawTitle = stripHtmlToText(innerHtml);
  const title = rawTitle.split(/\n+/)[0]?.trim() ?? "";
  if (!title) return null;

  const idMatch = attrs.match(/\bid="([^"]+)"/i);
  const id = idMatch?.[1] ?? slugify(title);

  return { type: "section", id, title, level };
}

function parseList(tag: "ul" | "ol", innerHtml: string): RedPolicyBlock | null {
  const items = [...innerHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((m) => stripHtmlToText(m[1]))
    .filter(Boolean);

  if (items.length === 0) return null;

  return {
    type: tag === "ol" ? "numberedList" : "bulletList",
    items,
  };
}

function rawElementToBlock(el: RawElement): RedPolicyBlock | null {
  const inner = el.html.replace(new RegExp(`^<${el.tag}[^>]*>|</${el.tag}>$`, "gi"), "");

  if (el.tag === "table") {
    return parseComparisonTable(el.html);
  }

  if (el.tag === "ul" || el.tag === "ol") {
    return parseList(el.tag, inner);
  }

  if (el.tag.startsWith("h")) {
    return parseHeading(el.tag, el.attrs, inner);
  }

  if (el.tag === "blockquote") {
    const text = stripHtmlToText(inner);
    return text ? { type: "quote", text } : null;
  }

  const text = stripHtmlToText(inner);
  if (!text) return null;

  const callout = parseCallout(text);
  if (callout) return callout;

  const example = parseExample(text);
  if (example) return example;

  if (/^неправильно$/i.test(text)) return null;
  if (/^правильно$/i.test(text)) return null;

  return { type: "paragraph", text };
}

function pairDoDontParagraphs(blocks: RedPolicyBlock[]): RedPolicyBlock[] {
  const result: RedPolicyBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const current = blocks[i];
    const next = blocks[i + 1];

    const third = blocks[i + 2];
    const fourth = blocks[i + 3];

    if (
      current.type === "paragraph" &&
      next?.type === "paragraph" &&
      third?.type === "paragraph" &&
      fourth?.type === "paragraph" &&
      /^неправильно$/i.test(current.text) &&
      /^правильно$/i.test(next.text)
    ) {
      const paired = parseDoDontFromParagraphs(third.text, fourth.text);
      if (paired) {
        result.push(paired);
        i += 4;
        continue;
      }
    }

    if (
      current.type === "paragraph" &&
      /^неправильно$/i.test(current.text) &&
      next?.type === "paragraph" &&
      !/^правильно$/i.test(next.text)
    ) {
      i += 1;
      continue;
    }

    result.push(current);
    i += 1;
  }

  return result;
}

function buildHero(raw: RawElement[]): { hero: RedPolicyHero; rest: RawElement[] } {
  if (raw.length === 0 || raw[0].tag !== "h1") {
    return {
      hero: { title: "Редполитика" },
      rest: raw,
    };
  }

  const title = stripHtmlToText(
    raw[0].html.replace(/^<h1[^>]*>|<\/h1>$/gi, ""),
  );
  const intro: string[] = [];
  let i = 1;

  while (i < raw.length && raw[i].tag === "p" && intro.length < 3) {
    const text = stripHtmlToText(raw[i].html.replace(/^<p[^>]*>|<\/p>$/gi, ""));
    if (text && !parseCallout(text) && !parseExample(text)) {
      intro.push(text);
    }
    i += 1;
  }

  while (i < raw.length && raw[i].tag === "p") {
    const text = stripHtmlToText(raw[i].html.replace(/^<p[^>]*>|<\/p>$/gi, ""));
    if (/^неправильно$/i.test(text) || /^правильно$/i.test(text)) break;
    i += 1;
  }

  return {
    hero: {
      title,
      subtitle: intro[0],
      description: intro.slice(1).join("\n\n") || undefined,
    },
    rest: raw.slice(i),
  };
}

export function parseGoogleDocHtml(documentHtml: string): RedPolicyDocument {
  const contentHtml = extractContentsHtml(documentHtml);
  const raw = extractRawElements(contentHtml);
  const { hero, rest } = buildHero(raw);

  const blocks: RedPolicyBlock[] = [];
  for (const el of rest) {
    const block = rawElementToBlock(el);
    if (block) blocks.push(block);
  }

  const merged = pairDoDontParagraphs(blocks);

  const sections = merged
    .filter((b): b is Extract<RedPolicyBlock, { type: "section" }> => b.type === "section")
    .filter((b) => b.level <= 2)
    .map((b) => ({ id: b.id, title: b.title, level: b.level as 1 | 2 }));

  if (sections.length === 0 && merged.length > 0) {
    sections.push({ id: "content", title: "Содержание", level: 1 });
  }

  return { hero, blocks: merged, sections };
}
