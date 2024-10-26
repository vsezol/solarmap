export class Terminal {
  #previousRows: string[] = [];

  write(content: string): void {
    process.stdout.write(content);
  }

  partialWrite(content: string): void {
    const newRows = content.split("\n");

    for (let i = 0; i < newRows.length; i++) {
      if (this.#previousRows[i] === newRows[i]) {
        continue;
      }

      this.setCursorToLine(i);
      this.updateLine(newRows[i]);
    }

    this.#previousRows = newRows;
  }

  clear(): void {
    process.stdout.write("\x1B[H");
    process.stdout.write("\x1B[J");
  }

  onResize(fn: () => unknown): void {
    process.on("SIGWINCH", fn);
  }

  hideCursor(): void {
    this.write("\x1B[?25l");
  }

  private setCursorToLine(line: number): void {
    this.write(`\x1B[${line};0H`);
  }

  private updateLine(str: string): void {
    this.write(str + "\x1B[K");
  }
}
