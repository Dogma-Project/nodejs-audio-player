# Dogma Shell Player

Node.js sound player. Player checks an available player and plays music with open and close handling.

## Installation

### via npm:

```
npm install @dogma-project/shell-player
```

## Usage

```
const DogmaPlayer = require("@dogma-project/shell-player");

const player = new DogmaPlayer(opts = {}, args = {});
player.play("http://online.radiorelax.ua/RadioRelax_Instrumental_Live");

player.on("ready", (data) => {
	console.log("playing stream", data);
	/*
		playing stream {
			player: 'mplayer', // selected player
			link: 'http://online.radiorelax.ua/RadioRelax_Instrumental_Live', // playing link
			pid: 111111 // player's process id
		}
	*/
	setTimeout(() => { // stop after 3 second
		player.stop(); // use only to stop and kill child proccess, you should call it before a next playing
	}, 3000);
});

player.on("close", (data) => {
	console.log("stream closed", data);
	/*
		stream closed {
			player: 'mplayer',  // used player
			code: 1, // exit code
			pid: 111111 // closed player's process id
		}
	*/
});

player.on("error", (err) => {
	console.error("error while playing stream", err);
});
```

```
// with options
const player = new DogmaPlayer({
	players: [ // optional (default values)
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
	],
	player: "mpg123", // optional. force specific player
	verbose: 0 // logging disabled by default. to enable, set verbose: 1
}, {
	"mpg123": ["-v", "-@"] // arguments for a specific player.
});

player.play("http://radio.nrcu.gov.ua:8000/golosdonbasu-mp3-m.m3u");
// mpg123 -v -@ http://radio.nrcu.gov.ua:8000/golosdonbasu-mp3-m.m3u
```

## History

TODO: Write history

## Credits

TODO: Write credits

## License

MIT License

Copyright (c) 2022 Dogma Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
