import createPlayer from "play-sound";
const player = createPlayer();

export const playMusic = () => {
  const audio = player.play("assets/sound.mp3", playMusic);

  return () => audio.kill();
};
