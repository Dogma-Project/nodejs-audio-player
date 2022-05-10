const findExec = require('find-exec');
const EventEmitter = require("events");
const { spawn } = require('child_process');
const Logger = require("./logger");

class DogmaPlayer extends EventEmitter {

    #process
    state

    /**
     * 
     * @param {Object} opts players, player, verbose
     * @param {Object} args { playerName: ['opt1', 'opt2'] }
     */
    constructor(opts, args) {
        super();
        opts = opts || {};
        args = args || {};

        this.players = opts.players || [
            'mplayer',
            'afplay',
            'mpg123',
            'mpg321',
            'play',
            'omxplayer',
            'aplay',
            'cmdmp3',
            'cvlc',
            'powershell'
        ];
        this.player = opts.player || findExec(this.players); // add exception

        Logger.verbose = opts.verbose || 0;
        Logger.log("player detected", this.player);
        this.state = -1;

        this.args = Array.isArray(args[this.player]) ? args[this.player] : [];

        this.on("state", (state) => {
            /*
                -1 - undefined
                0 - stopped
                1 - pending
                2 - spawned
                3 - child error
                4 - parent error
            */
            Logger.log("player state", state);
            this.state = state;
        })
    }

    /**
     * 
     * @param {String} link url or file location
     */
    play(link) {

        this.stop();
        this.emit("state", 1); // pending

        const opts = [...this.args, link];
        this.#process = spawn(this.player, opts, {
//            stdio: "ignore" 
        });

        this.#process.stdout.on('data', (data) => {
            data = data.toString();
            this.emit("log", data);
        });

        this.#process.stderr.on("data", (data) => {
            data = data.toString();
            this.emit("error-log", data);
        });

        this.#process.on("spawn", () => {;
            Logger.log("player", this.player, "successfully spawned. PID:", this.#process.pid);
            this.emit("state", 2);
            this.emit("ready", { 
                player: this.player,
                link,
                pid: this.#process.pid || -1
            });
        });

        this.#process.on("close", (code) => { 
            Logger.log("player", this.player, "successfully stopped. Code:", code);
            this.emit("state", 0);
            this.emit("close", { 
                player: this.player,
                code,
                pid: this.#process.pid || -1
            });
        });

        this.#process.on("error", (err) => {
            this.emit("state", 4);
            this.emit("error", err);
        });

    }

    stop() {
        if (this.#process) this.#process.kill();
    }

}

module.exports = DogmaPlayer;