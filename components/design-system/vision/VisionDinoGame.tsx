"use client";

import { useEffect, useRef } from "react";
import {
  VISION_DINO_THEME,
  type VisionDinoTheme,
} from "@/lib/vision-dino-theme";

type Obstacle = {
  x: number;
  w: number;
  h: number;
  kind: "bush" | "reed";
};

type Cake = {
  x: number;
  w: number;
  h: number;
  px: number;
};

type Layout = {
  width: number;
  height: number;
  groundY: number;
  px: number;
  dinoX: number;
  padX: number;
  padY: number;
};

type Runtime = {
  layout: Layout;
  running: boolean;
  gameOver: boolean;
  victory: boolean;
  jumpLocked: boolean;
  score: number;
  speed: number;
  frame: number;
  nextObstacleIn: number;
  dinoY: number;
  dinoVy: number;
  legFrame: number;
  obstacles: Obstacle[];
  cake: Cake | null;
  cakeSpawned: boolean;
  cakePending: boolean;
};

type VisionDinoGameProps = {
  theme?: VisionDinoTheme;
};

function getLayout(width: number, height: number): Layout {
  const padX = 12;
  const padY = 10;
  const px = Math.max(2, Math.round(height / 62));
  const waterDepth = Math.max(20, Math.round(height * 0.18));
  const groundY = height - waterDepth;

  return {
    width,
    height,
    groundY,
    px,
    dinoX: padX + px * 2,
    padX,
    padY,
  };
}

function waterHash(a: number, b: number) {
  return (((a * 374761393) ^ (b * 668265263)) >>> 0) % 1000;
}

function drawPixelSprite(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  originX: number,
  originY: number,
  cellPx: number,
  colors: Record<string, string>,
) {
  for (let row = 0; row < rows.length; row += 1) {
    const line = rows[row] ?? "";
    for (let col = 0; col < line.length; col += 1) {
      const color = colors[line[col] ?? ""];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(originX + col * cellPx, originY + row * cellPx, cellPx, cellPx);
    }
  }
}

/** Облака + линия берега + россыпь под водой (референс Chrome Dino) */
function drawPondScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  groundY: number,
  cellPx: number,
  theme: VisionDinoTheme,
) {
  const palette = {
    i: theme.sceneInk,
    x: theme.sceneInkStrong,
    c: theme.sceneDim,
  };

  drawPixelSprite(
    ctx,
    CLOUD_SPRITE,
    Math.round(width * 0.1),
    Math.max(cellPx * 2, Math.round(height * 0.08)),
    cellPx,
    palette,
  );
  drawPixelSprite(
    ctx,
    CLOUD_SPRITE,
    Math.round(width * 0.58),
    Math.max(cellPx * 3, Math.round(height * 0.14)),
    cellPx,
    palette,
  );

  for (let gy = groundY + cellPx; gy < height; gy += cellPx) {
    for (let gx = 0; gx < width; gx += cellPx) {
      const seed = waterHash(gx, gy);
      if (seed % 4 === 0) continue;

      ctx.fillStyle = theme.sceneDim;
      if (seed % 11 === 0) {
        const dashW = cellPx * (2 + (seed % 2));
        ctx.fillRect(gx, gy, Math.min(dashW, width - gx), Math.max(1, cellPx - 1));
      } else {
        ctx.fillRect(gx, gy, cellPx, cellPx);
      }
    }
  }

  ctx.fillStyle = theme.sceneInk;
  for (let gx = 0; gx < width; gx += cellPx) {
    const bumpUp = waterHash(gx, 1) % 15 === 0;
    const y = bumpUp ? groundY - cellPx : groundY;
    ctx.fillRect(gx, y, cellPx, cellPx);

    if (waterHash(gx, 3) % 9 === 0) {
      ctx.fillStyle = theme.sceneDim;
      ctx.fillRect(gx, groundY + cellPx, cellPx, cellPx);
      ctx.fillStyle = theme.sceneInk;
    }
  }
}

function createRuntime(width: number, height: number, theme: VisionDinoTheme): Runtime {
  return {
    layout: getLayout(width, height),
    running: false,
    gameOver: false,
    victory: false,
    jumpLocked: false,
    score: 0,
    speed: theme.gameplay.initialSpeed,
    frame: 0,
    nextObstacleIn: 48,
    dinoY: 0,
    dinoVy: 0,
    legFrame: 0,
    obstacles: [],
    cake: null,
    cakeSpawned: false,
    cakePending: false,
  };
}

function getCakeCellPx(layout: Layout, jumpY: number, legFrame: number) {
  const duckPx = getDuckSpriteMetrics(layout, jumpY, legFrame).px;
  return Math.max(
    1,
    Math.round((duckPx * DUCK_SPRITE_COLS * 2) / (CAKE_SPRITE_COLS * 3)),
  );
}

function spawnCake(runtime: Runtime) {
  const px = getCakeCellPx(runtime.layout, runtime.dinoY, runtime.legFrame);
  const w = CAKE_SPRITE_COLS * px;
  const h = CAKE_SPRITE_ROWS * px;

  runtime.cake = {
    x: runtime.layout.width + 12,
    w,
    h,
    px,
  };
  runtime.cakeSpawned = true;
}

function isInFrame(x: number, w: number, width: number) {
  return x < width && x + w > 0;
}

function isCakeVisible(cake: Cake, width: number) {
  return isInFrame(cake.x, cake.w, width);
}

function hasVisibleObstacles(obstacles: Obstacle[], width: number) {
  return obstacles.some((obstacle) => isInFrame(obstacle.x, obstacle.w, width));
}

function resetRuntime(runtime: Runtime, theme: VisionDinoTheme) {
  const { width, height } = runtime.layout;
  Object.assign(runtime, createRuntime(width, height, theme));
  runtime.running = true;
}

function spawnObstacle(runtime: Runtime) {
  const scale = runtime.layout.height / 140;
  const tallThreshold = Math.round(21 * Math.max(0.85, scale));
  const isReed = Math.random() > 0.45;
  const h = isReed
    ? Math.round((22 + Math.floor(Math.random() * 10)) * Math.max(0.85, scale))
    : Math.round((12 + Math.floor(Math.random() * 10)) * Math.max(0.85, scale));
  const w = isReed
    ? Math.round((22 + Math.floor(Math.random() * 6)) * Math.max(0.85, scale))
    : Math.round((8 + Math.floor(Math.random() * 8)) * Math.max(0.85, scale));

  runtime.obstacles.push({
    x: runtime.layout.width + 12,
    w,
    h,
    kind: isReed ? "reed" : "bush",
  });
}

/** 15×15 — пиксель-в-пиксель по референсу, зеркально вправо */
const RUBBER_DUCK_SPRITE = [
  "...............",
  "......yyyyy....",
  "......yyyyy....",
  ".....yyyyyyy...",
  ".....yyyyeoy...",
  ".....yyyyyoooo.",
  "......yyyyooo..",
  "......yyyyy....",
  ".yeyyy.yyyy....",
  ".yyeyyyeyyyy...",
  ".yyyeeeyyyyyy..",
  ".yyyyyyyyyyyy..",
  "..yyyyyyyyyy...",
  "...yyyyyyyy....",
  "...............",
];

const DUCK_SPRITE_COLS = RUBBER_DUCK_SPRITE[0]?.length ?? 15;
const DUCK_SPRITE_ROWS = RUBBER_DUCK_SPRITE.length;

/** 23×20 — пиксель-в-пиксель по референсу пользователя */
const CAKE_SPRITE = [
  "...........k...........",
  "..........kok..........",
  "....k.....krok....k....",
  "...kok...krrok...kok...",
  "..krok....kok...krok...",
  "...rro.....k.....rro...",
  "....k.....kwk.....k....",
  "...kwk....kwk....kwk...",
  "...kwk....kwk....kwk...",
  "...kwk....kwk....kwk...",
  ".kk...kkkk...kkkk...kk.",
  "k.pp...pppppppppp...ppk",
  "........pppppppp.......",
  "o....o...pppppp...o....",
  ".o..o.o............o...",
  "..oo...o........o...oo.",
  "........oooooooo.......",
  "ktttttttttttttttttttttk",
  "kwwwwwwwwwwwwwwwwwwwwwk",
  "kbbbbbbbbbbbbbbbbbbbbbk",
];

const CAKE_SPRITE_COLS = CAKE_SPRITE[0]?.length ?? 10;
const CAKE_SPRITE_ROWS = CAKE_SPRITE.length;

const CLOUD_SPRITE = [
  "...cccccc...",
  "..cccccccc..",
  ".cccccccccc.",
  "...cccccc...",
];

/** Один камыш */
const REED_SPRITE = [
  "..xxx..",
  "..xxx..",
  "..iii..",
  "..iii..",
  "..iii..",
  "..iii..",
  "..iii..",
  "..iii..",
  "..iii..",
  "./iii\\.",
  "/iiiii\\",
];

/** Куст камыша (4 стебля) */
const REED_CLUSTER_SPRITE = [
  ".x...x...x...x...",
  ".x...x...x...x...",
  ".i...i...i...i...",
  ".i...i...i...i...",
  ".i...i...i...i...",
  ".i...i...i...i...",
  ".i...i...i...i...",
  ".i...i...i...i...",
  ".i...i...i...i...",
  "./i.../i.../i.../i..",
  "/iiiiiiiiiiiiiii.",
];

const REED_SPRITE_COLS = REED_SPRITE[0]?.length ?? 7;
const REED_SPRITE_ROWS = REED_SPRITE.length;
const REED_CLUSTER_COLS = REED_CLUSTER_SPRITE[0]?.length ?? 17;
const REED_CLUSTER_ROWS = REED_CLUSTER_SPRITE.length;

/** 22×15 — низкий куст */
const BUSH_SPRITE = [
  "....mm................",
  "....mmmm..mm..........",
  "....mmdd..mmmd........",
  "....mmddd.ddmd.....mm.",
  ".....lmdd.dd.......mm.",
  ".....lddd.mm.......mm.",
  "..lmmmddd.mm.......mmm",
  ".mmmmdddd.dd....mm.ddm",
  "ddmmmdmmxxdd..dmmm.dd.",
  "ddlmxxmmxxx...mmdllddl",
  "ddmxxmllxxx...dddddddm",
  "ddmxxdddddd..ddddddmmm",
  "dddxddddmdxxddd.xddmmd",
  "dddxddddmmxxdxxxxxdmdd",
  ".dddxxxddmxxxxxxxx.dd.",
];

const BUSH_SPRITE_COLS = BUSH_SPRITE[0]?.length ?? 22;
const BUSH_SPRITE_ROWS = BUSH_SPRITE.length;

type DuckSpriteMetrics = {
  x: number;
  y: number;
  w: number;
  h: number;
  px: number;
};

function getDuckSpriteMetrics(
  layout: Layout,
  jumpY: number,
  legFrame: number,
): DuckSpriteMetrics {
  const { dinoX, groundY, height } = layout;
  const px = Math.max(1, Math.round(height / 87));
  const bob = legFrame % 2 === 0 ? 0 : 1;
  const w = DUCK_SPRITE_COLS * px;
  const h = DUCK_SPRITE_ROWS * px;

  return {
    x: dinoX,
    y: groundY - jumpY - h + bob,
    w,
    h,
    px,
  };
}

function drawDuck(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  jumpY: number,
  legFrame: number,
  theme: VisionDinoTheme,
) {
  const metrics = getDuckSpriteMetrics(layout, jumpY, legFrame);
  const colors: Record<string, string> = {
    y: theme.duckBody,
    o: theme.duckBeak,
    e: theme.duckEye,
  };

  for (let row = 0; row < RUBBER_DUCK_SPRITE.length; row += 1) {
    const line = RUBBER_DUCK_SPRITE[row] ?? "";
    for (let col = 0; col < line.length; col += 1) {
      const color = colors[line[col] ?? ""];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(
        metrics.x + col * metrics.px,
        metrics.y + row * metrics.px,
        metrics.px,
        metrics.px,
      );
    }
  }
}

function drawCake(
  ctx: CanvasRenderingContext2D,
  cake: Cake,
  groundY: number,
  theme: VisionDinoTheme,
) {
  const colors: Record<string, string> = {
    k: theme.cakeOutline,
    p: theme.cakeFrosting,
    t: theme.cakeLayer,
    w: theme.cakeCream,
    b: theme.cakeBase,
    s: theme.cakeCandleShadow,
    y: theme.cakeFlameYellow,
    o: theme.cakeFlameOrange,
    r: theme.cakeFlameRed,
  };
  const baseY = groundY - CAKE_SPRITE_ROWS * cake.px;

  for (let row = 0; row < CAKE_SPRITE.length; row += 1) {
    const line = CAKE_SPRITE[row] ?? "";
    for (let col = 0; col < line.length; col += 1) {
      const color = colors[line[col] ?? ""];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(
        cake.x + col * cake.px,
        baseY + row * cake.px,
        cake.px,
        cake.px,
      );
    }
  }
}

function drawBush(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle,
  groundY: number,
  theme: VisionDinoTheme,
) {
  const colors: Record<string, string> = {
    l: theme.bushLight,
    m: theme.bushMid,
    d: theme.bushDark,
    x: theme.bushShadow,
  };
  const px = Math.min(
    obstacle.h / BUSH_SPRITE_ROWS,
    obstacle.w / BUSH_SPRITE_COLS,
  );
  const spriteW = BUSH_SPRITE_COLS * px;
  const spriteH = BUSH_SPRITE_ROWS * px;
  const baseX = obstacle.x + (obstacle.w - spriteW) / 2;
  const baseY = groundY - spriteH;

  for (let row = 0; row < BUSH_SPRITE.length; row += 1) {
    const line = BUSH_SPRITE[row] ?? "";
    for (let col = 0; col < line.length; col += 1) {
      const color = colors[line[col] ?? ""];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(baseX + col * px, baseY + row * px, px, px);
    }
  }
}

function drawReed(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle,
  groundY: number,
  cellPx: number,
  theme: VisionDinoTheme,
) {
  const palette = {
    i: theme.sceneInk,
    x: theme.sceneInkStrong,
    "/": theme.sceneInk,
    "\\": theme.sceneInk,
  };
  const useCluster = obstacle.w >= REED_CLUSTER_COLS * cellPx * 0.85;
  const sprite = useCluster ? REED_CLUSTER_SPRITE : REED_SPRITE;
  const spriteW = sprite[0].length * cellPx;
  const spriteH = sprite.length * cellPx;
  const x = obstacle.x + (obstacle.w - spriteW) / 2;
  const y = groundY - spriteH;

  drawPixelSprite(ctx, sprite, x, y, cellPx, palette);
}

function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle,
  groundY: number,
  cellPx: number,
  theme: VisionDinoTheme,
) {
  if (obstacle.kind === "reed") {
    drawReed(ctx, obstacle, groundY, cellPx, theme);
    return;
  }

  drawBush(ctx, obstacle, groundY, theme);
}

function intersectsCake(
  layout: Layout,
  jumpY: number,
  legFrame: number,
  cake: Cake,
) {
  const metrics = getDuckSpriteMetrics(layout, jumpY, legFrame);
  const { groundY } = layout;
  const dinoBox = {
    x: metrics.x + metrics.px * 2,
    y: metrics.y + metrics.px * 2,
    w: metrics.w - metrics.px * 4,
    h: metrics.h - metrics.px * 2,
  };
  const cakeBox = {
    x: cake.x + cake.px,
    y: groundY - cake.h + cake.px,
    w: cake.w - cake.px * 2,
    h: cake.h - cake.px,
  };

  return (
    dinoBox.x < cakeBox.x + cakeBox.w &&
    dinoBox.x + dinoBox.w > cakeBox.x &&
    dinoBox.y < cakeBox.y + cakeBox.h &&
    dinoBox.y + dinoBox.h > cakeBox.y
  );
}

function intersects(
  layout: Layout,
  jumpY: number,
  legFrame: number,
  obstacle: Obstacle,
) {
  const metrics = getDuckSpriteMetrics(layout, jumpY, legFrame);
  const { groundY } = layout;
  const dinoBox = {
    x: metrics.x + metrics.px * 2,
    y: metrics.y + metrics.px * 2,
    w: metrics.w - metrics.px * 4,
    h: metrics.h - metrics.px * 2,
  };

  const obsBox = {
    x: obstacle.x + 1,
    y: groundY - obstacle.h,
    w: obstacle.w - 2,
    h: obstacle.h,
  };

  return (
    dinoBox.x < obsBox.x + obsBox.w &&
    dinoBox.x + dinoBox.w > obsBox.x &&
    dinoBox.y < obsBox.y + obsBox.h &&
    dinoBox.y + dinoBox.h > obsBox.y
  );
}

export function VisionDinoGame({ theme = VISION_DINO_THEME }: VisionDinoGameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const runtime = createRuntime(280, 140, themeRef.current);
    let raf = 0;
    let dpr = 1;

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      runtime.layout = getLayout(width, height);
    };

    const draw = () => {
      const currentTheme = themeRef.current;
      const { width, height, groundY, padX, padY, px } = runtime.layout;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (currentTheme.background !== "transparent") {
        ctx.fillStyle = currentTheme.background;
        ctx.fillRect(0, 0, width, height);
      }

      drawPondScene(ctx, width, height, groundY, px, currentTheme);

      for (const obstacle of runtime.obstacles) {
        if (runtime.cake && isCakeVisible(runtime.cake, width)) continue;
        drawObstacle(ctx, obstacle, groundY, px, currentTheme);
      }

      if (runtime.cake) {
        drawCake(ctx, runtime.cake, groundY, currentTheme);
      }

      drawDuck(ctx, runtime.layout, runtime.dinoY, runtime.legFrame, currentTheme);

      ctx.font = "600 11px var(--font-geist-mono, monospace)";
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillStyle = currentTheme.score;
      ctx.fillText(
        String(Math.floor(runtime.score)).padStart(5, "0"),
        width - padX,
        padY,
      );

      if (!runtime.running && !runtime.gameOver) {
        ctx.font = "500 10px var(--font-geist-sans, sans-serif)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = currentTheme.hint;
        ctx.fillText("Тап или пробел", width / 2, groundY - 28);
      }

      if (runtime.gameOver || runtime.victory) {
        ctx.fillStyle = "rgba(0,0,0,0.42)";
        ctx.fillRect(0, 0, width, height);

        ctx.font = "500 12px var(--font-geist-sans, sans-serif)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = runtime.victory
          ? currentTheme.victory
          : currentTheme.gameOver;
        ctx.fillText(
          runtime.victory ? "Ты затащил в релиз!" : "Ещё раз?",
          width / 2,
          height / 2 - 6,
        );
        ctx.font = "400 10px var(--font-geist-sans, sans-serif)";
        ctx.fillStyle = currentTheme.hint;
        ctx.fillText("тап / пробел", width / 2, height / 2 + 12);
      }

      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    };

    const tick = () => {
      const currentTheme = themeRef.current;

      if (runtime.running && !runtime.gameOver && !runtime.victory) {
        runtime.frame += 1;
        runtime.score += 0.08;
        runtime.speed = Math.min(
          currentTheme.gameplay.maxSpeed,
          runtime.speed + currentTheme.gameplay.speedIncrease,
        );

        runtime.dinoVy -= currentTheme.gameplay.gravity;
        runtime.dinoY += runtime.dinoVy;

        if (runtime.dinoY <= 0) {
          runtime.dinoY = 0;
          runtime.dinoVy = 0;
        }

        runtime.legFrame += 1;

        if (
          !runtime.cakeSpawned &&
          !runtime.cakePending &&
          Math.floor(runtime.score) >= currentTheme.gameplay.victoryScore
        ) {
          runtime.cakePending = true;
        }

        if (
          runtime.cakePending &&
          !hasVisibleObstacles(runtime.obstacles, runtime.layout.width)
        ) {
          spawnCake(runtime);
          runtime.cakePending = false;
        }

        if (runtime.cake) {
          runtime.cake = {
            ...runtime.cake,
            x: runtime.cake.x - runtime.speed,
          };

          if (isCakeVisible(runtime.cake, runtime.layout.width)) {
            runtime.jumpLocked = true;
          }

          if (intersectsCake(runtime.layout, runtime.dinoY, runtime.legFrame, runtime.cake)) {
            runtime.victory = true;
            runtime.running = false;
          }
        }

        if (!runtime.cakeSpawned && !runtime.cakePending) {
          runtime.nextObstacleIn -= 1;

          if (runtime.nextObstacleIn <= 0) {
            spawnObstacle(runtime);
            runtime.nextObstacleIn =
              currentTheme.gameplay.obstacleGapMin +
              Math.random() *
                (currentTheme.gameplay.obstacleGapMax -
                  currentTheme.gameplay.obstacleGapMin);
          }
        }

        runtime.obstacles = runtime.obstacles
          .map((obstacle) => ({ ...obstacle, x: obstacle.x - runtime.speed }))
          .filter((obstacle) => obstacle.x + obstacle.w > -12);

        if (!runtime.victory && !(runtime.cake && isCakeVisible(runtime.cake, runtime.layout.width))) {
          for (const obstacle of runtime.obstacles) {
            if (intersects(runtime.layout, runtime.dinoY, runtime.legFrame, obstacle)) {
              runtime.gameOver = true;
              runtime.running = false;
              break;
            }
          }
        }
      }

      draw();
      raf = window.requestAnimationFrame(tick);
    };

    const jump = () => {
      if (runtime.gameOver || runtime.victory) {
        resetRuntime(runtime, themeRef.current);
        return;
      }

      if (!runtime.running) {
        runtime.running = true;
      }

      if (runtime.jumpLocked) {
        return;
      }

      if (runtime.dinoY <= 0.5) {
        runtime.dinoVy = themeRef.current.gameplay.jumpVelocity;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault();
      jump();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.code !== "ArrowUp") return;
      event.preventDefault();
      jump();
    };

    resize();
    draw();
    raf = window.requestAnimationFrame(tick);

    const observer = new ResizeObserver(resize);
    const observeTarget = host.parentElement ?? host;
    observer.observe(observeTarget);
    if (observeTarget !== host) {
      observer.observe(host);
    }
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0 min-h-0 min-w-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none select-none"
        aria-label="Мини-игра с резиновой уточкой"
        role="img"
      />
    </div>
  );
}
