import fs from "fs";
import sharp from "sharp";

const p =
  "C:/Users/desbl/.cursor/projects/g-ds-dashboard/assets/c__Users_desbl_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_noun-icon-template-29200-6bac6387-e0cd-49a3-a9a1-c9559c1580fe.png";

const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

let minL = 255;
let maxL = 0;
for (let i = 0; i < data.length; i += 4) {
  const L = (data[i] + data[i + 1] + data[i + 2]) / 3;
  minL = Math.min(minL, L);
  maxL = Math.max(maxL, L);
}
console.log("size", width, height, "lum", minL, "-", maxL);

// dump ascii preview
const step = Math.max(1, Math.floor(width / 80));
for (let y = 0; y < height; y += step) {
  let row = "";
  for (let x = 0; x < width; x += step) {
    const i = (y * width + x) * 4;
    const L = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const a = data[i + 3];
    row += a < 20 ? " " : L > 200 ? "#" : L > 100 ? "+" : ".";
  }
  console.log(row);
}
