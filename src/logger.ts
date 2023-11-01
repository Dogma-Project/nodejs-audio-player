const Logger = {
  verbose: 0,

  log: (...args: any) => {
    Logger.verbose && console.log("[DOGMA PLAYER LOG]", ...args);
  },

  warn: (...args: any) => {
    Logger.verbose && console.warn("[DOGMA PLAYER WARN]", ...args);
  },

  error: (...args: any) => {
    console.error("[DOGMA PLAYER ERROR]", ...args);
  },
};

export default Logger;
