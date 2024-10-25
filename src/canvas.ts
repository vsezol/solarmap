import { Buffer } from "buffer";
import process from "process";
import { bg, fg, rs, type Color } from "./color.js";

interface Point {
  x: number;
  y: number;
}

const MAP = [
  [0x1, 0x8],
  [0x2, 0x10],
  [0x4, 0x20],
  [0x40, 0x80],
];

const getMask = (x: number, y: number) =>
  MAP[Math.floor(y) % 4][Math.floor(x) % 2];

const CHAR_WIDTH = 2;
const CHAR_HEIGHT = 4;
const CHAR_SIZE = CHAR_WIDTH * CHAR_HEIGHT;

export class Canvas {
  readonly width: number;
  readonly height: number;
  readonly #content: Buffer;
  readonly #text: (string | undefined)[];

  readonly #colors: Color[];
  readonly #bgColors: Color[];

  get center(): Point {
    return {
      x: this.width / 2,
      y: this.height / 2,
    };
  }

  constructor(width?: number, height?: number) {
    const rows = process.stdout.rows;
    const columns = process.stdout.columns;

    this.width = width ?? columns * CHAR_WIDTH - CHAR_WIDTH;
    this.height = height ?? rows * CHAR_HEIGHT;

    this.#content = Buffer.alloc((this.width * this.height) / CHAR_SIZE);
    this.#colors = new Array(this.#content.length).fill("default");
    this.#bgColors = new Array(this.#content.length).fill("default");
    this.#text = new Array(this.#content.length).fill(undefined);
  }

  clear(color: Color = "default"): void {
    this.#colors.fill(color);
    this.#bgColors.fill(color);
    this.#text.fill(undefined);
    this.#content.fill(0);
  }

  frame(delimiter = "\n"): string {
    const frameWidth = this.width / CHAR_WIDTH;

    const result = this.#content.reduce<string[]>((acc, cur, i) => {
      if (i % frameWidth === 0) {
        acc.push(delimiter);
      }

      let char: string;
      if (typeof this.#text[i] === "string") {
        char = this.#text[i] ?? " ";
      } else {
        char = cur ? String.fromCharCode(0x2800 + cur) : " ";
      }

      const colored = rs(fg(bg(char, this.#bgColors[i]), this.#colors[i]));
      acc.push(colored);

      return acc;
    }, []);

    result.push(delimiter);

    return result.join("");
  }

  set(x: number, y: number, color: Color = "white"): void {
    const charIndex = this.toCharIndex(x, y);

    if (!charIndex) {
      return;
    }

    const mask = getMask(x, y);

    if (color) {
      this.#colors[charIndex] = color;
    }
    this.#content[charIndex] |= mask;
  }

  unset(x: number, y: number): void {
    const charIndex = this.toCharIndex(x, y);

    if (!charIndex) {
      return;
    }

    const mask = getMask(x, y);

    this.#colors[charIndex] = "default";
    this.#content[charIndex] &= ~mask;
  }

  line(x0: number, y0: number, x1: number, y1: number, color?: Color): void {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      this.set(x0, y0, color);

      if (x0 === x1 && y0 === y1) break;

      const e2 = 2 * err;

      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }

      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  circle(x0: number, y0: number, radius: number, color?: Color): void {
    let x = radius;
    let y = 0;
    let decisionOver2 = 1 - x;

    while (x >= y) {
      this.line(x0 - x, y0 + y, x0 + x, y0 + y, color);
      this.line(x0 - x, y0 - y, x0 + x, y0 - y, color);
      this.line(x0 - y, y0 + x, x0 + y, y0 + x, color);
      this.line(x0 - y, y0 - x, x0 + y, y0 - x, color);

      y++;
      if (decisionOver2 <= 0) {
        decisionOver2 += 2 * y + 1;
      } else {
        x--;
        decisionOver2 += 2 * (y - x) + 1;
      }
    }
  }

  ring(x0: number, y0: number, radius: number, color?: Color): void {
    let x = radius;
    let y = 0;
    let decisionOver2 = 1 - x;

    while (x >= y) {
      this.set(x0 + x, y0 + y, color);
      this.set(x0 + y, y0 + x, color);
      this.set(x0 - y, y0 + x, color);
      this.set(x0 - x, y0 + y, color);
      this.set(x0 - x, y0 - y, color);
      this.set(x0 - y, y0 - x, color);
      this.set(x0 + y, y0 - x, color);
      this.set(x0 + x, y0 - y, color);

      y++;
      if (decisionOver2 <= 0) {
        decisionOver2 += 2 * y + 1;
      } else {
        x--;
        decisionOver2 += 2 * (y - x) + 1;
      }
    }
  }

  rect(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color: Color = "default"
  ) {
    this.line(x0, y0, x1, y0, color);
    this.line(x1, y0, x1, y1, color);
    this.line(x0, y1, x1, y1, color);
    this.line(x0, y0, x0, y1, color);
  }

  clearReact(x0: number, y0: number, x1: number, y1: number) {
    for (let i = y0; i < y1; i++) {
      for (let j = x0; j < x1; j++) {
        this.unset(j, i);
      }
    }
  }

  fillRect(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color: Color = "default"
  ) {
    for (let i = y0; i < y1; i++) {
      this.line(x0, i, x1, i, color);
    }
  }

  bgRect(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color: Color = "default"
  ): void {
    for (let i = y0; i < y1; i++) {
      for (let j = x0; j < x1; j++) {
        const charIndex = this.toCharIndex(j, i);
        if (!charIndex) {
          return;
        }
        this.#bgColors[charIndex] = color;
      }
    }
  }

  text(x: number, y: number, text: string, color: Color = "white"): void {
    x = Math.floor(x);
    y = Math.floor(y);

    const charIndex = this.toCharIndex(x, y);

    if (!charIndex) {
      return;
    }

    for (let i = 0; i < text.length; i++) {
      this.#text[charIndex + i] = text[i];
      this.#colors[charIndex + i] = color;
    }
  }

  private toCharIndex(x: number, y: number): number | undefined {
    if (!(x >= 0 && x < this.width && y >= 0 && y < this.height)) {
      return undefined;
    }

    x = Math.floor(x);
    y = Math.floor(y);

    const nx = Math.floor(x / CHAR_WIDTH);
    const ny = Math.floor(y / CHAR_HEIGHT);
    const coord = nx + (this.width / CHAR_WIDTH) * ny;

    return coord;
  }
}
