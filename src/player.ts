import { ChildProcess } from "child_process";
import path from "path";
import createPlayer from "play-sound";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      path.join(__dirname, "assets/sound.mp3"),
      () => this.running && this.play()
    );
  }

  stop(): void {
    this.#running = false;
    this.#audio?.kill();
    this.#audio = undefined;
  }
}
