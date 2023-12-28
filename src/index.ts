const findExec = require("find-exec");
import Logger from "./logger";
import EventEmitter from "node:events";
import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";

type DogmaPlayerOpts = {
  players?: string[];
  player?: string;
  verbose?: number;
};

type DogmaPlayerArgs = {
  [index: string]: string[];
};

enum PlayerState {
  unknown,
  stopped,
  pending,
  spawned,
  child_error,
  parent_error,
}

class DogmaPlayer extends EventEmitter {
  players: string[];
  player: string;
  process: ChildProcessWithoutNullStreams | null;
  state: PlayerState = PlayerState.unknown;
  args: string[];

  /**
   *
   * @param opts
   * @param args arguments for players
   */
  constructor(opts: DogmaPlayerOpts, args: DogmaPlayerArgs) {
    super();
    opts = opts || {};
    args = args || {};

    this.players = opts.players || [
      "mplayer",
      "afplay",
      "mpg123",
      "mpg321",
      "play",
      "omxplayer",
      "aplay",
      "cmdmp3",
      "cvlc",
      "powershell",
    ];
    this.player = opts.player || findExec(this.players); // add exception

    Logger.verbose = opts.verbose || 0;
    Logger.log("player detected", this.player);
    this.process = null;

    this.args = this.player && args[this.player] ? args[this.player] : [];

    this.on("state", (state: PlayerState) => {
      Logger.log("player state", state);
      this.state = state;
    });
  }

  /**
   *
   * @param link url or file location
   */
  play(link: string) {
    this.stop();
    this.emit("state", PlayerState.pending);

    const opts = [...this.args, link];
    this.process = spawn(this.player, opts, {
      //            stdio: "ignore"
    });
    const { pid } = this.process;
    const player = this.player;

    this.process.stdout.on("data", (data) => {
      data = data.toString();
      this.emit("log", data);
    });

    this.process.stderr.on("data", (data) => {
      data = data.toString();
      this.emit("error-log", data);
    });

    this.process.on("spawn", () => {
      Logger.log(`Player ${player} successfully stopped. PID: ${pid}`);
      this.emit("state", PlayerState.spawned);
      this.emit("ready", { player, link, pid });
    });

    this.process.on("close", (code) => {
      Logger.log(
        `Player ${player} successfully stopped. Code: ${code}. PID: ${pid}`
      );
      this.emit("state", PlayerState.stopped);
      this.emit("close", { player, code, pid });
    });

    this.process.on("error", (err) => {
      this.emit("state", PlayerState.child_error);
      this.emit("error", err);
    });
  }

  stop() {
    if (this.process) this.process.kill();
  }
}

export default DogmaPlayer;
module.exports = DogmaPlayer;
