#!/usr/bin/env node

import { Canvas } from "./canvas.js";
import { asteroids, planets, sun } from "./config.js";
import { getSettings } from "./get-settings.js";
import { Keyboard } from "./keyboard.js";
import { Monitoring } from "./monitoring.js";
import { Player } from "./player.js";
import { Terminal } from "./terminal.js";
import { Asteroid, Moon, Planet } from "./types.js";
import { version } from "./version.js";

const settings = getSettings();
const terminal = new Terminal();
const keyboard = new Keyboard();
const monitoring = new Monitoring();
const player = new Player();

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
      if (player.running) {
        settings.sound = false;
        player.stop();
      } else {
        settings.sound = true;
        player.play();
      }
      break;
    case "o":
      settings.orbits = !settings.orbits;
      break;
    case "h":
      settings.hints = !settings.hints;
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
  drawToolbar();
  drawAppInfo();

  terminal.partialWrite(canvas.frame());

  monitoring.measure();

  setTimeout(() => animate(), Math.round(1000 / settings.fps));
};

terminal.hideCursor();

animate();

if (settings.sound) {
  player.play();
  keyboard.onExit(() => player.stop());
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
  const angle = monitoring.ticks * asteroid.speed + asteroid.angle;
  const x = canvas.center.x + asteroid.radius * Math.cos(angle);
  const y = canvas.center.y + asteroid.radius * Math.sin(angle);

  canvas.set(x, y);
}

function drawMoon(moon: Moon, x: number, y: number): void {
  const angle = monitoring.ticks * moon.speed;
  const moonX = x + moon.orbitRadius * Math.cos(angle);
  const moonY = y + moon.orbitRadius * Math.sin(angle);

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
  const x = 0;
  const y = canvas.height - 1;

  canvas.clearReact(x, y - 5, x + 600, canvas.width);
  canvas.text(x, y, `${monitoring.fps} FPS (press ↑ or ↓)`);
  drawCheckbox(x + 44, y, settings.sound);
  canvas.text(x + 48, y, `sound (press s)`);
  drawCheckbox(x + 80, y, settings.orbits);
  canvas.text(x + 84, y, `orbits (press o)`);
  drawCheckbox(x + 118, y, settings.hints);
  canvas.text(x + 122, y, `hints (press h)`);
}

function drawCheckbox(x: number, y: number, value: boolean): void {
  canvas.text(x, y, value ? "◉" : "◯", value ? "green" : "white");
}
