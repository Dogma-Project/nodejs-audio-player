"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findExec = require("find-exec");
const logger_1 = __importDefault(require("./logger"));
const node_events_1 = __importDefault(require("node:events"));
const node_child_process_1 = require("node:child_process");
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["unknown"] = 0] = "unknown";
    PlayerState[PlayerState["stopped"] = 1] = "stopped";
    PlayerState[PlayerState["pending"] = 2] = "pending";
    PlayerState[PlayerState["spawned"] = 3] = "spawned";
    PlayerState[PlayerState["child_error"] = 4] = "child_error";
    PlayerState[PlayerState["parent_error"] = 5] = "parent_error";
})(PlayerState || (PlayerState = {}));
class DogmaPlayer extends node_events_1.default {
    /**
     *
     * @param opts
     * @param args arguments for players
     */
    constructor(opts, args) {
        super();
        this.state = PlayerState.unknown;
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
        logger_1.default.verbose = opts.verbose || 0;
        logger_1.default.log("player detected", this.player);
        this.process = null;
        this.args = this.player && args[this.player] ? args[this.player] : [];
        this.on("state", (state) => {
            logger_1.default.log("player state", state);
            this.state = state;
        });
    }
    /**
     *
     * @param link url or file location
     */
    play(link) {
        this.stop();
        this.emit("state", PlayerState.pending);
        const opts = [...this.args, link];
        this.process = (0, node_child_process_1.spawn)(this.player, opts, {
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
            logger_1.default.log(`Player ${player} successfully stopped. PID: ${pid}`);
            this.emit("state", PlayerState.spawned);
            this.emit("ready", { player, link, pid });
        });
        this.process.on("close", (code) => {
            logger_1.default.log(`Player ${player} successfully stopped. Code: ${code}. PID: ${pid}`);
            this.emit("state", PlayerState.stopped);
            this.emit("close", { player, code, pid });
        });
        this.process.on("error", (err) => {
            this.emit("state", PlayerState.child_error);
            this.emit("error", err);
        });
    }
    stop() {
        if (this.process)
            this.process.kill();
    }
}
exports.default = DogmaPlayer;
