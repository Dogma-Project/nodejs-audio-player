/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from "node:events";
import { ChildProcessWithoutNullStreams } from "node:child_process";
type DogmaPlayerOpts = {
    players?: string[];
    player?: string;
    verbose?: number;
};
type DogmaPlayerArgs = {
    [index: string]: string[];
};
declare enum PlayerState {
    unknown = 0,
    stopped = 1,
    pending = 2,
    spawned = 3,
    child_error = 4,
    parent_error = 5
}
declare class DogmaPlayer extends EventEmitter {
    players: string[];
    player: string;
    process: ChildProcessWithoutNullStreams | null;
    state: PlayerState;
    args: string[];
    /**
     *
     * @param opts
     * @param args arguments for players
     */
    constructor(opts: DogmaPlayerOpts, args: DogmaPlayerArgs);
    /**
     *
     * @param link url or file location
     */
    play(link: string): void;
    stop(): void;
}
export default DogmaPlayer;
