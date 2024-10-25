export class Terminal {
  print(content: string): void {
    process.stdout.write(content);
  }

  clear(): void {
    process.stdout.write("\x1Bc");
  }

  onResize(fn: () => unknown): void {
    process.on("SIGWINCH", fn);
  }
}
