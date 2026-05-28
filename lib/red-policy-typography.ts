import type {
  RedPolicyBlock,
  RedPolicyDocument,
  RedPolicyHero,
} from "@/types/red-policy";

const NBSP = "\u00A0";

const HANGING_WORDS_LIST =
  "и|а|но|ли|ль|же|бы|в|во|без|до|из|к|ко|на|над|о|об|обо|от|по|под|при|с|со|у|за|про|для|через|между|перед|после|около|либо|как|что|чтобы|если|когда|хотя|пока|где|куда|откуда|ни|не|нибудь|так|то|это|ты|вы|мы|он|она|оно|они|их|им|её|его";

/** Предлоги, союзы, частицы — неразрывный пробел вместо обычного после слова */
const HANGING_WORDS = new RegExp(
  `(^|[\\s(«"—–-])(${HANGING_WORDS_LIST})(\\s+)`,
  "gi",
);

/** Исправления орфографии / опечаток из исходника (без смены смысла) */
const ORTHOGRAPHY_FIXES: [RegExp, string][] = [
  [/Грамота\.ру/g, "Грамота.ру"],
  [/Суточно\.ру/g, "Суточно.ру"],
  [/копейки/gi, "копейки"],
  [/запятой/gi, "запятой"],
  [/авторский/gi, "авторский"],
  [/который/gi, "который"],
  [/сильный/gi, "сильный"],
  [/копирайтеров/gi, "копирайтеров"],
  [/путешествию/gi, "путешествию"],
];

function normalizeUnicode(text: string): string {
  return text.normalize("NFC");
}

function fixOrthography(text: string): string {
  let out = text;
  for (const [pattern, replacement] of ORTHOGRAPHY_FIXES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

function collapseSpaces(text: string): string {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^ +| +$/gm, "");
}

function fixEllipsis(text: string): string {
  return text.replace(/(?<!\.)\.\.\.(?!\.)/g, "…");
}

function fixQuotes(text: string): string {
  let out = text;
  // Прямые лапки → ёлочки (вне вложенных « »)
  out = out.replace(/"([^"]+)"/g, "«$1»");
  out = out.replace(/'([^']+)'/g, "„$1\u201C");
  return out;
}

function fixDashes(text: string): string {
  let out = text;
  // Диапазоны чисел: дефис → среднее тире
  out = out.replace(/(\d)\s*-\s*(\d)/g, `$1${NBSP}–$2`);
  // Двойной дефис → длинное тире
  out = out.replace(/--/g, "—");
  // Пробел + дефис + пробел между словами → длинное тире с неразрывными пробелами
  out = out.replace(/(\S)\s+-\s+(\S)/g, `$1${NBSP}—${NBSP}$2`);
  // Пробелы вокруг длинного тире
  out = out.replace(/(\S)\s+—\s+/g, `$1${NBSP}—${NBSP}`);
  out = out.replace(/\s+—\s+(\S)/g, `${NBSP}—${NBSP}$1`);
  return out;
}

function fixNumberTypography(text: string): string {
  let out = text;
  // Разряды: 1 000 000
  out = out.replace(/\b(\d{1,3})(?:\s+(\d{3}))+\b/g, (match) =>
    match.replace(/ /g, NBSP),
  );
  // Число + %
  out = out.replace(/(\d)\s+%/g, `$1${NBSP}%`);
  // Число + валюта
  out = out.replace(/(\d[\d${NBSP}]*)\s+([₽$€])/g, `$1${NBSP}$2`);
  return out;
}

function fixPunctuationSpacing(text: string): string {
  let out = text.replace(/\s+([,.;:!?])/g, "$1");
  // Запятая в десятичных (50 356,77) — без пробела после
  out = out.replace(/,(?=\d)/g, ",");
  out = out.replace(/([;:!?])(?=[^\s\n])/g, "$1 ");
  out = out.replace(/,(?=[^\s\n\d])/g, ", ");
  // Точка перед буквой — домены и сокращения (Суточно.ру), без пробела
  out = out.replace(/\.(?=[\p{L}\p{N}])/gu, ".");
  // Точка перед пробелом/концом — обычный разделитель предложения
  out = out.replace(/\.(?=\s|$)/g, ". ");
  return out.replace(/ {2,}/g, " ");
}

function applyHangingPrepositions(text: string): string {
  return text.replace(HANGING_WORDS, (_match, before: string, word: string) => `${before}${word}${NBSP}`);
}

function protectBrandTokens(text: string): string {
  return text.replace(/Суточно\.ру/gi, "Суточно\uE000.ру");
}

function restoreBrandTokens(text: string): string {
  return text.replace(/Суточно\uE000\.ру/gi, "Суточно.ру");
}

function polishLine(line: string): string {
  if (!line.trim()) return line;
  let out = normalizeUnicode(line);
  out = protectBrandTokens(out);
  out = fixOrthography(out);
  out = collapseSpaces(out);
  out = fixEllipsis(out);
  out = fixQuotes(out);
  out = fixDashes(out);
  out = fixNumberTypography(out);
  out = fixPunctuationSpacing(out);
  out = applyHangingPrepositions(out);
  out = collapseSpaces(out);
  out = restoreBrandTokens(out);
  return out;
}

/** Типографическая правка без изменения тона и формулировок */
export function polishRedPolicyText(text: string): string {
  if (!text) return text;
  return text
    .split("\n")
    .map((line) => polishLine(line))
    .join("\n");
}

function polishHeadingTitle(title: string): string {
  const firstLine = title.split(/\n+/)[0]?.trim() ?? title;
  return polishRedPolicyText(firstLine);
}

function polishHero(hero: RedPolicyHero): RedPolicyHero {
  return {
    title: polishRedPolicyText(hero.title.replace(/^копия\s+/i, "").trim()),
    subtitle: hero.subtitle ? polishRedPolicyText(hero.subtitle) : undefined,
    description: hero.description ? polishRedPolicyText(hero.description) : undefined,
  };
}

function shouldPolishBlock(block: RedPolicyBlock): boolean {
  return block.type !== "example" && block.type !== "doDont";
}

function polishBlock(block: RedPolicyBlock): RedPolicyBlock {
  if (!shouldPolishBlock(block)) return block;

  switch (block.type) {
    case "section":
      return { ...block, title: polishHeadingTitle(block.title) };
    case "paragraph":
    case "quote":
      return { ...block, text: polishRedPolicyText(block.text) };
    case "callout":
      return {
        ...block,
        title: block.title ? polishRedPolicyText(block.title) : undefined,
        text: polishRedPolicyText(block.text),
      };
    case "bulletList":
    case "numberedList":
      return { ...block, items: block.items.map((item) => polishRedPolicyText(item)) };
    default:
      return block;
  }
}

export function applyTypographyToDocument(doc: RedPolicyDocument): RedPolicyDocument {
  const blocks = doc.blocks.map(polishBlock);
  const sections = doc.sections.map((s) => ({
    ...s,
    title: polishHeadingTitle(s.title),
  }));

  return {
    hero: polishHero(doc.hero),
    blocks,
    sections,
  };
}
