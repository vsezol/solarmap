import { ChildProcess } from "child_process";
import path from "path";
import createPlayer from "play-sound";

export class Player {
  #audio: ChildProcess | undefined;
  readonly #player = createPlayer();
  #running: boolean = false;

  get running(): boolean {
    return this.#running;
  }

  play(): void {
    this.#running = true;
    this.#audio = this.#player.play(
      path.join(process.cwd(), "assets/sound.mp3"),
      () => this.running && this.play()
    );
  }

  stop(): void {
    this.#running = false;
    this.#audio?.kill();
    this.#audio = undefined;
  }
}
