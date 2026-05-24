export type Platform = "ios" | "android" | "web";

const SPREADSHEET_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQWMcZY-0g_3bIjXZ5e_2p9055zquUVQsibDGDyki2CTLzdFGfXalD__GEK4-O0CGJhxoCRQCrCBa3t";

const SHEET_GIDS: Record<Platform, string> = {
  ios: "0",
  android: "837676628",
  web: "180247072",
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  ios: "iOS",
  android: "Android",
  web: "Web",
};

export const CSV_URLS: Record<Platform, string> = {
  ios: `${SPREADSHEET_BASE}/pub?gid=${SHEET_GIDS.ios}&single=true&output=csv`,
  android: `${SPREADSHEET_BASE}/pub?gid=${SHEET_GIDS.android}&single=true&output=csv`,
  web: `${SPREADSHEET_BASE}/pub?gid=${SHEET_GIDS.web}&single=true&output=csv`,
};

export const SHEET_HTML_URLS: Record<Platform, string> = {
  ios: `${SPREADSHEET_BASE}/pubhtml/sheet?headers=false&gid=${SHEET_GIDS.ios}`,
  android: `${SPREADSHEET_BASE}/pubhtml/sheet?headers=false&gid=${SHEET_GIDS.android}`,
  web: `${SPREADSHEET_BASE}/pubhtml/sheet?headers=false&gid=${SHEET_GIDS.web}`,
};

export const PLATFORMS: Platform[] = ["ios", "android", "web"];
