const Logger = {

    log: (...args) => {
        console.log("[DOGMA PLAYER LOG]", ...args);
    },
    
    warn: (...args) => {
        console.warn("[DOGMA PLAYER WARN]", ...args);
    },
    
    error: (...args) => {
        console.error("[DOGMA PLAYER ERROR]", ...args);
    }

}

module.exports = Logger;