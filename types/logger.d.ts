declare const Logger: {
    verbose: number;
    log: (...args: any) => void;
    warn: (...args: any) => void;
    error: (...args: any) => void;
};
export default Logger;
