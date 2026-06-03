import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import opentype from "opentype.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cssUrl =
  "https://fonts.googleapis.com/css2?family=Roboto+Flex:slnt,wght@-10,800&display=swap";
const css = await (
  await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })
).text();

if (css.includes("400:")) {
  throw new Error("Google Fonts CSS request failed:\n" + css.slice(0, 400));
}

const fontUrls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(
  (match) => match[1],
);
const fontUrl =
  fontUrls.find((url) => url.includes("latin") && !url.includes("latin-ext")) ??
  fontUrls[0];

if (!fontUrl) {
  throw new Error("Roboto Flex slnt -10 / wght 800 woff2 URL not found");
}

console.log("font:", fontUrl);

const fontBuffer = Buffer.from(await (await fetch(fontUrl)).arrayBuffer());
const font = opentype.parse(fontBuffer.buffer);

const fontSize = 32;
const text = "UTOPIA DS";

let x = 0;
const measure = new opentype.Path();

for (const char of text) {
  const glyph = font.charToGlyph(char);
  measure.extend(glyph.getPath(x, 0, fontSize));
  x += font.getAdvanceWidth(char, fontSize);
}

const bbox = measure.getBoundingBox();
const width = bbox.x2 - bbox.x1;
const height = bbox.y2 - bbox.y1;
const scale = 226 / width;
const offsetX = -bbox.x1 * scale;
const offsetY = (32 - height * scale) / 2 - bbox.y1 * scale;

x = 0;
const combined = new opentype.Path();
for (const char of text) {
  const glyph = font.charToGlyph(char);
  combined.extend(glyph.getPath(x * scale + offsetX, offsetY, fontSize * scale));
  x += font.getAdvanceWidth(char, fontSize);
}

const d = combined.toPathData(3);

const outSvg = path.join(__dirname, "../public/images/vision/utopia-ds-logo.svg");
fs.writeFileSync(
  outSvg,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 226 32" fill="none" role="img" aria-label="UTOPIA DS">
  <path fill="#fff" d="${d}"/>
</svg>`,
);

const outTs = path.join(__dirname, "../components/design-system/vision/utopia-ds-logo-path.ts");
fs.writeFileSync(
  outTs,
  `/** Auto-generated — Google Fonts Roboto Flex wght 800, slnt -10 */\nexport const UTOPIA_DS_LOGO_PATH = ${JSON.stringify(d)};\nexport const UTOPIA_DS_LOGO_VIEWBOX = "0 0 226 32" as const;\n`,
);

console.log("wrote", outSvg, "path chars:", d.length);
