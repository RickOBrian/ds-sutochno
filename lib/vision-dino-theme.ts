/** Настройки мини-игры динозаврика для плашки «Персонализация» */
export type VisionDinoTheme = {
  background: string;
  sceneInk: string;
  sceneInkStrong: string;
  sceneDim: string;
  duckBody: string;
  duckBeak: string;
  duckEye: string;
  bushLight: string;
  bushMid: string;
  bushDark: string;
  bushShadow: string;
  score: string;
  hint: string;
  gameOver: string;
  victory: string;
  cakeOutline: string;
  cakeFrosting: string;
  cakeLayer: string;
  cakeCream: string;
  cakeBase: string;
  cakeCandleShadow: string;
  cakeFlameYellow: string;
  cakeFlameOrange: string;
  cakeFlameRed: string;
  gameplay: {
    gravity: number;
    jumpVelocity: number;
    initialSpeed: number;
    maxSpeed: number;
    speedIncrease: number;
    obstacleGapMin: number;
    obstacleGapMax: number;
    victoryScore: number;
  };
};

export const VISION_DINO_THEME: VisionDinoTheme = {
  background: "transparent",
  sceneInk: "rgba(255,255,255,0.52)",
  sceneInkStrong: "rgba(255,255,255,0.78)",
  sceneDim: "rgba(255,255,255,0.2)",
  duckBody: "#ffb700",
  duckBeak: "#ff7a00",
  duckEye: "#111111",
  bushLight: "#b8e986",
  bushMid: "#6ea843",
  bushDark: "#4f7f31",
  bushShadow: "#365f24",
  score: "rgba(255,255,255,0.55)",
  hint: "rgba(255,255,255,0.28)",
  gameOver: "rgba(255,255,255,0.72)",
  victory: "rgba(255,255,255,0.72)",
  cakeOutline: "#1f1f1f",
  cakeFrosting: "#ff55cc",
  cakeLayer: "#ffc08d",
  cakeCream: "#ffffff",
  cakeBase: "#9c5a1a",
  cakeCandleShadow: "#b2b2b2",
  cakeFlameYellow: "#ffff00",
  cakeFlameOrange: "#ff8000",
  cakeFlameRed: "#ff0000",
  gameplay: {
    gravity: 0.62,
    jumpVelocity: 9.5,
    initialSpeed: 5.2,
    maxSpeed: 9.5,
    speedIncrease: 0.0012,
    obstacleGapMin: 52,
    obstacleGapMax: 110,
    victoryScore: 60,
  },
};
