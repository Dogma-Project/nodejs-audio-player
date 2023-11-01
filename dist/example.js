"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const player = new index_1.default({
    verbose: 1,
    // player: "mpg123"
}, {
    mpg123: ["-v", "-@"],
});
player.on("ready", (data) => {
    console.log("playing stream", data);
});
player.on("close", (data) => {
    console.log("stream closed", data);
});
player.on("error", (err) => {
    console.error("error while playing stream", err);
});
player.play("http://online.radiorelax.ua/RadioRelax_Live");
setTimeout(() => {
    player.play("http://online.radiorelax.ua/RadioRelax_Instrumental_Live");
    // player.stop();
}, 3000);
