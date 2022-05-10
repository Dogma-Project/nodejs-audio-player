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
     */
    constructor(opts) {
        super();
        opts = opts || {};
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
     * @param {Object} opts 
     */
    play(link, opts) {

        this.stop();
        this.emit("state", 1); // pending

        this.#process = spawn(this.player, [link], {
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
            Logger.log("player", this.player, "successfully spawned.");
            this.emit("state", 2);
            this.emit("ready", { 
                player: this.player,
                link
            });
        });

        this.#process.on("close", (code) => { 
            Logger.log("player", this.player, "successfully stopped. Code:", code);
            this.emit("state", 0);
            this.emit("close", { 
                player: this.player,
                code
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