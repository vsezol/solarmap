#!/usr/bin/env node

import { Canvas } from "./canvas.js";
import type { Color } from "./color.js";

const canvas = new Canvas();

interface Planet {
  name: string;
  radius: number;
  distance: number;
  color: Color;
  speed: number;
  rings?: Color[];
}

// Setup planets and properties
const planets: Planet[] = [
  { name: "Mercury", radius: 1, distance: 25, color: "default", speed: 20 },
  { name: "Venus", radius: 3, distance: 35, color: "yellow", speed: 13.9 },
  { name: "Earth", radius: 4, distance: 47, color: "blue", speed: 11.4 },
  { name: "Mars", radius: 3, distance: 60, color: "red", speed: 8.7 },
  { name: "Jupiter", radius: 6, distance: 85, color: "yellow", speed: 3.6 },
  {
    name: "Saturn",
    radius: 4,
    distance: 107,
    color: "white",
    speed: 2,
    rings: ["default", "default"],
  },
  {
    name: "Uranus",
    radius: 4,
    distance: 125,
    color: "green",
    speed: 0.7,
    rings: ["green"],
  },
  {
    name: "Neptune",
    radius: 4,
    distance: 140,
    color: "blue",
    speed: 0.1,
  },
];

const jupiterMoons: Moon[] = [
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
];

interface Asteroid {
  radius: number;
  angle: number;
  speed: number;
}

const asteroids: Asteroid[] = Array.from({ length: 250 }, () => ({
  radius: 65 + Math.random() * 5,
  angle: Math.random() * 2 * Math.PI,
  speed: 0.005 + Math.random() * 0.002,
}));

const kuiperBelt: Asteroid[] = Array.from({ length: 1000 }, () => {
  const randomRadius = Math.random() * 40;
  const radius = 150 + randomRadius;
  return {
    radius,
    angle: Math.random() * 2 * Math.PI,
    speed: 0.001 + Math.random() * 0.002 + randomRadius * 0.0002,
  };
});

interface Sun {
  x: number;
  y: number;
  radius: number;
  color: Color;
}

const sun: Sun = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  color: "yellow",
};

interface Moon {
  name: string;
  orbitRadius: number;
  speed: number;
  angle: number;
  color: Color;
}

const moon: Moon = {
  name: "moon",
  orbitRadius: 8,
  speed: 0.6,
  angle: 0,
  color: "white",
};

let time = 0;

function drawSun() {
  canvas.circle(sun.x, sun.y, sun.radius, sun.color);
}

function drawPlanet(planet: Planet, angle: number) {
  const x = sun.x + planet.distance * Math.cos(angle);
  const y = sun.y + planet.distance * Math.sin(angle);

  canvas.circle(x, y, planet.radius, planet.color);

  if (planet.name === "Earth") {
    drawMoon(x, y);
  }

  if (planet.name === "Jupiter") {
    drawJupiterMoons(x, y);
  }

  if (planet.rings) {
    planet.rings.forEach((color, i) => {
      canvas.ring(x, y, planet.radius + 3 + i, color);
    });
  }
}

function drawAsteroids(asteroids: Asteroid[]) {
  asteroids.forEach((asteroid) => {
    const x = sun.x + asteroid.radius * Math.cos(asteroid.angle);
    const y = sun.y + asteroid.radius * Math.sin(asteroid.angle);

    canvas.set(x, y);
  });
}

function drawMoon(earthX: number, earthY: number) {
  const moonX = earthX + moon.orbitRadius * Math.cos(moon.angle);
  const moonY = earthY + moon.orbitRadius * Math.sin(moon.angle);

  canvas.circle(moonX, moonY, 1, moon.color);
}

function drawOrbit(planet: Planet) {
  canvas.ring(sun.x, sun.y, planet.distance);
}

function drawJupiterMoons(x: number, y: number) {
  jupiterMoons.forEach((m) => {
    const moonX = x + m.orbitRadius * Math.cos(m.angle);
    const moonY = y + m.orbitRadius * Math.sin(m.angle);

    canvas.circle(moonX, moonY, 1, m.color);
  });
}

function animate() {
  canvas.clear();
  process.stdout.write("\x1Bc");

  // Draw Sun
  drawSun();

  // Draw planets and their orbits
  planets.forEach((planet) => {
    const angle = time * planet.speed;
    drawOrbit(planet);
    drawPlanet(planet, angle);
  });

  moon.angle += moon.speed;
  jupiterMoons.forEach((moon) => {
    moon.angle += moon.speed;
  });

  drawAsteroids(kuiperBelt);
  kuiperBelt.forEach((item) => {
    item.angle += item.speed;
  });
  drawAsteroids(asteroids);
  asteroids.forEach((item) => {
    item.angle += item.speed;
  });

  time += 0.001;

  process.stdout.write(canvas.frame());
  setTimeout(() => animate(), 30);
}

// Start animation
animate();
