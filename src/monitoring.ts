export class Monitoring {
  #currentFps: number = 0;
  #time: number = performance.now();

  get fps(): number {
    return this.#currentFps;
  }

  get ticks(): number {
    return this.#time / 100000;
  }

  measure(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.#time;

    this.#currentFps = Math.floor(1000 / deltaTime);
    this.#time = currentTime;
  }
}
