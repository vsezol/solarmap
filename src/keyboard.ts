import readline from "readline";

export class Keyboard {
  readonly #exitHandlers = new Set<() => unknown>();

  constructor() {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
  }

  onExit(handler: () => unknown): void {
    this.#exitHandlers.add(handler);
  }

  on(keyHandler: (key: string) => unknown): void {
    process.stdin.on("keypress", (_, key) => {
      if (key.ctrl && key.name === "c") {
        this.#exitHandlers.forEach((fn) => fn());

        process.exit();
      }

      keyHandler(key.name);
    });
  }
}
