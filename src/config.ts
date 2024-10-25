import { Asteroid, Planet, Sun } from "./types";

export const planets: Planet[] = [
  {
    name: "Mercury",
    radius: 1,
    distance: 25,
    color: "white",
    speed: 20,
  },
  {
    name: "Venus",
    radius: 3,
    distance: 35,
    color: "yellow",
    speed: 13.9,
  },
  {
    name: "Earth",
    radius: 4,
    distance: 47,
    color: "blue",
    speed: 11.4,
    moons: [
      {
        name: "Moon",
        orbitRadius: 8,
        speed: 0.6,
        angle: 0,
        color: "white",
      },
    ],
  },
  {
    name: "Mars",
    radius: 3,
    distance: 60,
    color: "red",
    speed: 8.7,
  },
  {
    name: "Jupiter",
    radius: 6,
    distance: 85,
    color: "yellow",
    speed: 3.6,
    moons: [
      {
        name: "Io",
        orbitRadius: 9,
        speed: 0.2,
        angle: 0,
        color: "yellow",
      },
      {
        name: "Europa",
        orbitRadius: 10,
        speed: 0.15,
        angle: 0,
        color: "white",
      },
      {
        name: "Ganymede",
        orbitRadius: 12,
        speed: 0.1,
        angle: 0,
        color: "white",
      },
    ],
  },
  {
    name: "Saturn",
    radius: 4,
    distance: 107,
    color: "white",
    speed: 2,
    rings: [{ distance: 3 }, { distance: 4 }],
  },
  {
    name: "Uranus",
    radius: 4,
    distance: 125,
    color: "green",
    speed: 0.7,
    rings: [{ distance: 3, color: "green" }],
  },
  {
    name: "Neptune",
    radius: 4,
    distance: 140,
    color: "blue",
    speed: 0.1,
  },
];

export const asteroids: Asteroid[] = [
  Array.from({ length: 250 }, () => ({
    radius: 65 + Math.random() * 5,
    angle: Math.random() * 2 * Math.PI,
    speed: 0.005 + Math.random() * 0.002,
  })),
  Array.from({ length: 1000 }, () => {
    const randomRadius = Math.random() * 40;
    const radius = 150 + randomRadius;
    return {
      radius,
      angle: Math.random() * 2 * Math.PI,
      speed: 0.001 + Math.random() * 0.002 + randomRadius * 0.0002,
    };
  }),
].flat();

export const sun: Sun = {
  radius: 15,
  color: "yellow",
  name: "Sun",
};
