import { Buffer } from "buffer";
import process from "process";
import type { Color } from "./color.js";
import { fg } from "./color.js";

const map = [
  [0x1, 0x8],
  [0x2, 0x10],
  [0x4, 0x20],
  [0x40, 0x80],
];

export class Canvas {
  readonly width: number;
  readonly height: number;
  readonly #content: Buffer;

  readonly #colors: Color[];

  constructor(width?: number, height?: number) {
    this.width = width ?? process.stdout.columns * 2 - 2;
    this.height = height ?? process.stdout.rows * 4;
    this.#content = Buffer.alloc((this.width * this.height) / 8);
    this.#colors = new Array(this.#content.length).fill("default");
  }

  clear() {
    this.#colors.fill("default");
    this.#content.fill(0);
  }

  frame(delimiter = "\n") {
    const frameWidth = this.width / 2;

    const result = this.#content.reduce<string[]>((acc, cur, i) => {
      if (i % frameWidth === 0) {
        acc.push(delimiter);
      }

      acc.push(
        cur ? fg(String.fromCharCode(0x2800 + cur), this.#colors[i]) : " "
      );

      return acc;
    }, []);

    result.push(delimiter);

    return result.join("");
  }

  set(x: number, y: number, color?: Color): void {
    if (!(x >= 0 && x < this.width && y >= 0 && y < this.height)) {
      return;
    }
    x = Math.floor(x);
    y = Math.floor(y);
    const nx = Math.floor(x / 2);
    const ny = Math.floor(y / 4);
    const coord = nx + (this.width / 2) * ny;

    const mask = map[y % 4][x % 2];

    if (color) {
      this.#colors[coord] = color;
    }
    this.#content[coord] |= mask;
  }

  unset(x: number, y: number): void {
    if (!(x >= 0 && x < this.width && y >= 0 && y < this.height)) {
      return;
    }
    x = Math.floor(x);
    y = Math.floor(y);
    const nx = Math.floor(x / 2);
    const ny = Math.floor(y / 4);
    const coord = nx + (this.width / 2) * ny;
    const mask = map[y % 4][x % 2];

    this.#colors[coord] = "default";
    this.#content[coord] &= ~mask;
  }

  line(x0: number, y0: number, x1: number, y1: number, color?: Color) {
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

  circle(x0: number, y0: number, radius: number, color?: Color) {
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

  ring(x0: number, y0: number, radius: number, color?: Color) {
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
}
