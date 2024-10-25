import { Color } from "./color.js";

export interface Planet {
  name: PlanetName;
  radius: number;
  distance: number;
  color: Color;
  speed: number;
  rings?: PlanerRing[];
  moons?: Moon[];
}

export type PlanetName =
  | "Mercury"
  | "Venus"
  | "Earth"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune";

export interface PlanerRing {
  distance: number;
  color?: Color;
}

export interface Asteroid {
  radius: number;
  angle: number;
  speed: number;
}

export interface Sun {
  radius: number;
  color: Color;
}

export interface Moon {
  name: string;
  orbitRadius: number;
  speed: number;
  angle: number;
  color: Color;
}
