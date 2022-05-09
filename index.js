const findExec = require('find-exec');
const EventEmitter = require("events");
const { spawn } = require('child_process');
const Logger = require("./logger");

class DogmaPlayer extends EventEmitter {

    #process
    state

    /**
     * 
     * @param {Object} opts players, player
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

    play(link, opts) {

        this.stop();

        this.emit("state", 1); // pending
        this.#process = spawn(this.player, [link], {
//            stdio: "ignore" // check
        });

        this.#process.stdout.on('data', (data) => {
            data = data.toString();
            // Logger.log("stdout", data);
            this.emit("log", data);
        });

        this.#process.stderr.on("data", (data) => {
            data = data.toString();
            this.emit("child-error-log", data);
        });

        this.#process.on("spawn", () => {;
            Logger.log("Successfully spawned", this.player);
            this.emit("ready", true);
            this.emit("state", 2);
        });
        this.#process.on("error", (err) => {
            this.emit("parent-error", err);
            this.emit("state", 4);
        });

        this.#process.on("close", (code) => { 
            if (code !== null) {
                switch (this.state) {
                    case 0:
                        // ignore
                    break;
                    case 1:
                        this.emit("client-fail", code);
                    break;
                    case 2:
                        this.emit("client-error", code);
                    break;
                    default:
                        
                    break;
                }
                this.emit("state", 3);                
            } else {
                Logger.log("player", this.player, "successfully stopper");
            }
        });

    }

    stop() {
        this.emit("state", 0);
        if (this.#process) this.#process.kill();
    }

}

module.exports = DogmaPlayer;