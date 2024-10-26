# Solar Map

Solar Map is a solar system simulation in your terminal, using a high-performance custom rendering engine to display any content directly in the terminal. It leverages a partial content update mechanism to achieve high FPS and eliminate screen flickering, ensuring smooth animations and a responsive experience.

## Usage

The application runs in the terminal and renders an animated simulation of the solar system. The simulation updates in real-time, with adjustable frame rate and interactive controls.

To start the Solar Map simulation, use:

```bash
npx solarmap
```

## Demo

[Watch demo video on YouTube!](https://youtu.be/YyhdgBIF7J8)

![Demo gif](/media/demo.gif)

## Controls

- **Arrow Up (↑):** Increase FPS.
- **Arrow Down (↓):** Decrease FPS.
- **'S' Key:** Toggle sound on/off.
- **'O' Key:** Toggle orbit visibility.
- **'H' Key:** Toggle celestial body names visibility.
- **Ctrl + C:** Exit the application.

## Configuration

You can also launch the application with the following flags:

- `--sound`: Enable sound playback.
- `--fps xx`: Set a custom starting FPS.
- `--no-orbits`: Disable the display of orbits.
- `--hints`: Enable the display of celestial body names.

You can combine multiple flags as needed:

```bash
npx solarmap --fps 30 --sound --no-orbits --hints
```

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for more details.
