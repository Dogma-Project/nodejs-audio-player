const Logger = {

    verbose: 0,

    log: (...args) => {
        Logger.verbose && console.log("[DOGMA PLAYER LOG]", ...args);
    },
    
    warn: (...args) => {
        Logger.verbose && console.warn("[DOGMA PLAYER WARN]", ...args);
    },
    
    error: (...args) => {
        console.error("[DOGMA PLAYER ERROR]", ...args);
    }

}

module.exports = Logger;