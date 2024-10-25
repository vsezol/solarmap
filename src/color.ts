export type Color =
  | "default"
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white";

const RESET = "\x1b[0m";

export const fg = (str: string, color: Color) => `\x1b[${FG[color]}m${str}`;

export const bg = (str: string, color: Color) => `\x1b[${BG[color]}m${str}`;

export const rs = (str: string) => str + RESET;

const FG: Record<Color, number> = {
  default: 1,
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
};

const BG: Record<Color, number> = {
  default: 1,
  black: 40,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  white: 47,
};
