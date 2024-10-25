#!/usr/bin/env node

import { Canvas } from "./canvas.js";
import { asteroids, planets, sun } from "./config.js";
import { Terminal } from "./terminal.js";
import { Asteroid, Moon, Planet } from "./types.js";

const DEFAULT_FPS = 20;

const args = process.argv;

const hasClear = args.includes("--clear");

const fpsArg = Number(args[args.indexOf("--fps") + 1]);
const fps = isNaN(fpsArg) ? DEFAULT_FPS : fpsArg;

const canvas = new Canvas();
const terminal = new Terminal();

const center = canvas.center;

const animate = (): void => {
  const time = performance.now() / 100000;

  canvas.clear();

  drawSun();

  planets.forEach((planet) => {
    drawOrbit(planet);
    drawPlanet(planet, time);
  });
  asteroids.forEach(drawAsteroid);

  hasClear && terminal.clear();
  terminal.print(canvas.frame());

  setTimeout(() => animate(), Math.round(1000 / fps));
};

animate();

function drawSun(): void {
  canvas.circle(center.x, center.y, sun.radius, sun.color);
}

function drawPlanet(planet: Planet, time: number): void {
  const angle = time * planet.speed;
  const x = center.x + planet.distance * Math.cos(angle);
  const y = center.y + planet.distance * Math.sin(angle);

  canvas.circle(x, y, planet.radius, planet.color);

  planet.rings?.forEach(({ distance, color = "white" }) => {
    canvas.ring(x, y, planet.radius + distance, color);
  });

  planet.moons?.forEach((moon) => {
    drawMoon(moon, x, y);
    moon.angle += moon.speed;
  });
}

function drawAsteroid(asteroid: Asteroid): void {
  const x = center.x + asteroid.radius * Math.cos(asteroid.angle);
  const y = center.y + asteroid.radius * Math.sin(asteroid.angle);
  asteroid.angle += asteroid.speed;

  canvas.set(x, y);
}

function drawMoon(moon: Moon, x: number, y: number): void {
  const moonX = x + moon.orbitRadius * Math.cos(moon.angle);
  const moonY = y + moon.orbitRadius * Math.sin(moon.angle);

  canvas.circle(moonX, moonY, 1, moon.color);
}

function drawOrbit(planet: Planet): void {
  canvas.ring(center.x, center.y, planet.distance);
}
