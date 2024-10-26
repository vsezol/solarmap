#!/usr/bin/env node

import { Canvas } from "./canvas.js";
import { asteroids, planets, sun } from "./config.js";
import { getSettings } from "./get-settings.js";
import { Keyboard } from "./keyboard.js";
import { Monitoring } from "./monitoring.js";
import { playMusic } from "./play-music.js";
import { Terminal } from "./terminal.js";
import { Asteroid, Moon, Planet } from "./types.js";
import { version } from "./version.js";

const settings = getSettings();
const terminal = new Terminal();
const keyboard = new Keyboard();
const monitoring = new Monitoring();

let canvas = new Canvas();
terminal.onResize(() => {
  canvas = new Canvas();
});

keyboard.on((key) => {
  switch (key) {
    case "up":
      settings.fps++;
      break;
    case "down":
      settings.fps--;
      break;
    case "s":
      settings.sound = !settings.sound;
      break;
  }
});

const animate = (): void => {
  canvas.clear();

  drawSun();

  planets.forEach((planet) => {
    settings.orbits && drawOrbit(planet);
    drawPlanet(planet);
  });
  asteroids.forEach(drawAsteroid);

  drawAuthorInfo();
  drawAppInfo();
  drawToolbar();

  terminal.clear();
  terminal.print(canvas.frame());

  monitoring.measure();

  setTimeout(() => animate(), Math.round(1000 / settings.fps));
};

animate();

if (settings.sound) {
  const stopMusic = playMusic();
  keyboard.onExit(() => stopMusic());
}

function drawSun(): void {
  canvas.circle(canvas.center.x, canvas.center.y, sun.radius, sun.color);

  settings.hints && drawHint(canvas.center.x, canvas.center.y, sun.name);
}

function drawPlanet(planet: Planet): void {
  const angle = monitoring.ticks * planet.speed;
  const x = canvas.center.x + planet.distance * Math.cos(angle);
  const y = canvas.center.y + planet.distance * Math.sin(angle);

  canvas.circle(x, y, planet.radius, planet.color);

  planet.rings?.forEach(({ distance, color = "white" }) =>
    canvas.ring(x, y, planet.radius + distance, color)
  );

  planet.moons?.forEach((moon) => drawMoon(moon, x, y));

  settings.hints && drawHint(x, y, planet.name);
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
  moon.angle += moon.speed;

  canvas.circle(moonX, moonY, 1, moon.color);

  settings.hints && drawHint(moonX, moonY, moon.name);
}

function drawOrbit(planet: Planet): void {
  canvas.ring(canvas.center.x, canvas.center.y, planet.distance);
}

function drawHint(x: number, y: number, text: string): void {
  canvas.text(x - Math.ceil(text.length / 2), y, text);
}

function drawAuthorInfo(): void {
  canvas.text(12, 12, "Vsevolod Zolotov, Senior Dev.");
  canvas.text(12, 20, "website:");
  canvas.text(30, 20, "https://vsezol.com", "green");
}

function drawAppInfo(): void {
  const text = `ver. ${version}`;
  canvas.text(canvas.width - text.length * 2, canvas.height - 1, text);
}

function drawToolbar(): void {
  canvas.text(
    0,
    canvas.height - 1,
    `${monitoring.fps} FPS (press ↑ or ↓) ${
      settings.sound ? "✔" : "☓"
    } sound (press s)`
  );
}
