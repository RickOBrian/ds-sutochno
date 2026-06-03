const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const filePath = path.join(__dirname, "../public/images/vision/utopia-mascot-ducks.png");
const THRESHOLD = 42;
const ALPHA_CUT = 20;

function isBackground(r, g, b, a) {
  if (a < ALPHA_CUT) return true;
  return r <= THRESHOLD && g <= THRESHOLD && b <= THRESHOLD;
}

function idx(x, y, w) {
  return (w * y + x) << 2;
}

const input = fs.readFileSync(filePath);
const png = PNG.sync.read(input);
const { width: w, height: h, data } = png;
const visited = new Uint8Array(w * h);
const queue = [];

function push(x, y) {
  if (x < 0 || y < 0 || x >= w || y >= h) return;
  const i = y * w + x;
  if (visited[i]) return;
  visited[i] = 1;
  queue.push(i);
}

for (let x = 0; x < w; x++) {
  push(x, 0);
  push(x, h - 1);
}
for (let y = 0; y < h; y++) {
  push(0, y);
  push(w - 1, y);
}

while (queue.length) {
  const i = queue.pop();
  const x = i % w;
  const y = (i / w) | 0;
  const p = idx(x, y, w);
  const r = data[p];
  const g = data[p + 1];
  const b = data[p + 2];
  const a = data[p + 3];
  if (!isBackground(r, g, b, a)) continue;

  data[p + 3] = 0;

  push(x - 1, y);
  push(x + 1, y);
  push(x, y - 1);
  push(x, y + 1);
}

let minX = w;
let minY = h;
let maxX = 0;
let maxY = 0;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const p = idx(x, y, w);
    if (data[p + 3] < ALPHA_CUT) continue;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
}

const pad = 2;
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(w - 1, maxX + pad);
maxY = Math.min(h - 1, maxY + pad);
const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;

const cropped = new PNG({ width: cropW, height: cropH });
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const src = idx(minX + x, minY + y, w);
    const dst = idx(x, y, cropW);
    cropped.data[dst] = data[src];
    cropped.data[dst + 1] = data[src + 1];
    cropped.data[dst + 2] = data[src + 2];
    cropped.data[dst + 3] = data[src + 3];
  }
}

fs.writeFileSync(filePath, PNG.sync.write(cropped));
console.log(`cropped ${w}x${h} -> ${cropW}x${cropH}`);
