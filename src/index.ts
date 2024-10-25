#!/usr/bin/env node

import { Canvas } from "./canvas.js";
import { asteroids, planets, sun } from "./config.js";
import { Terminal } from "./terminal.js";
import { Asteroid, Moon, Planet } from "./types.js";
import { version } from "./version.js";

const DEFAULT_FPS = 20;

const args = process.argv;

const fpsArg = Number(args[args.indexOf("--fps") + 1]);
const fps = isNaN(fpsArg) ? DEFAULT_FPS : fpsArg;

const terminal = new Terminal();

let canvas = new Canvas();

terminal.onResize(() => {
  canvas = new Canvas();
});

let time = performance.now();
let currentFps = fps;

const animate = (): void => {
  const ticks = time / 100000;

  canvas.clear();

  drawSun();

  planets.forEach((planet) => {
    drawOrbit(planet);
    drawPlanet(planet, ticks);
  });
  asteroids.forEach(drawAsteroid);

  drawAuthorInfo();
  drawAppInfo();

  terminal.clear();
  terminal.print(canvas.frame());
  calcFps();

  setTimeout(() => animate(), Math.round(1000 / fps));
};

animate();

function drawSun(): void {
  canvas.circle(canvas.center.x, canvas.center.y, sun.radius, sun.color);
}

function drawPlanet(planet: Planet, ticks: number): void {
  const angle = ticks * planet.speed;
  const x = canvas.center.x + planet.distance * Math.cos(angle);
  const y = canvas.center.y + planet.distance * Math.sin(angle);

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
  const x = canvas.center.x + asteroid.radius * Math.cos(asteroid.angle);
  const y = canvas.center.y + asteroid.radius * Math.sin(asteroid.angle);
  asteroid.angle += asteroid.speed;

  canvas.set(x, y);
}

function drawMoon(moon: Moon, x: number, y: number): void {
  const moonX = x + moon.orbitRadius * Math.cos(moon.angle);
  const moonY = y + moon.orbitRadius * Math.sin(moon.angle);

  canvas.circle(moonX, moonY, 1, moon.color);
}

function drawOrbit(planet: Planet): void {
  canvas.ring(canvas.center.x, canvas.center.y, planet.distance);
}

function drawAuthorInfo(): void {
  canvas.text(12, 12, "Vsevolod Zolotov, Senior Dev.");
  canvas.text(12, 20, "website:");
  canvas.text(30, 20, "https://vsezol.com", "green");
}

function calcFps(): void {
  const currentTime = performance.now();
  const deltaTime = currentTime - time;
  currentFps = Math.floor(1000 / deltaTime);
  time = currentTime;
}

function drawAppInfo(): void {
  const text = `ver. ${version} | ${currentFps} FPS`;

  canvas.text(canvas.width - text.length * 2, canvas.height - 1, text);
}
