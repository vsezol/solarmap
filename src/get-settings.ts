export interface Settings {
  fps: number;
  orbits: boolean;
  sound: boolean;
  hints: boolean;
}

const DEFAULT_FPS = 20;

export const getSettings = (): Settings => {
  const args = process.argv;

  const fpsArg = Number(args[args.indexOf("--fps") + 1]);
  const fps = isNaN(fpsArg) ? DEFAULT_FPS : fpsArg;
  const hints = args.includes("--hints");
  const orbits = !args.includes("--no-orbits");
  const sound = !args.includes("--no-sound");

  return {
    fps,
    hints,
    orbits,
    sound,
  };
};
