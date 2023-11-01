import DogmaPlayer from "./index";

const player = new DogmaPlayer(
  {
    verbose: 1,
    // player: "mpg123"
  },
  {
    mpg123: ["-v", "-@"],
  }
);

player.on("ready", (data) => {
  console.log("playing stream", data);
});

player.on("close", (data) => {
  console.log("stream closed", data);
});

player.on("error", (err) => {
  console.error("error while playing stream", err);
});

player.play("http://online.radiorelax.ua/RadioRelax_Live");
setTimeout(() => {
  player.play("http://online.radiorelax.ua/RadioRelax_Instrumental_Live");
  // player.stop();
}, 3000);
