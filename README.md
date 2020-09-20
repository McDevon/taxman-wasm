# Taxman WASM

This is the [Taxman Engine](https://github.com/mcdevon/taxman-engine) ported to Wasm.

The purpose of this project is to help me learn Wasm, as well as allow me to join game jams with [Playdate](http://play.date) games all the while allowing everyone to play even if they do not own the console.

Online demo is [available here](https://mcdevon.github.io/taxman-wasm/). NOTE: the demo has a platformer scene, which is currently not part of this repository. This is due to the demo having a trademarked character. After a new character is added, the platformer scene with sources and assets will be made available here.

## Requirements

1. For compiling, [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) needs to be installed and in `PATH`
2. The example uses Python 3 for serving the page locally. Any other means of setting up a server is equally adequate

## Running

Run in command line:

```
make
cd docs && python -m http.server
```

Then open a browser and head to [http://localhost:8000]()

## Features

- Runs games built with Taxman Engine in browser
- Rendering the display
- Mapping of keys

## Rough Backlog

- Add the platformer scene with non-trademarked assets to the repository
- Add missing controls (at least crank & accelerometer)
- Audio
- Mobile support
- Use proper assets instead of the hack with uncompressed binaries that is currently in use

## Contributing

All contributions, especially issues, comments, and pull request are warmly welcome. This repository is maintained as a side project, and as such, it is unfortunately not possible to guarantee frequent updates.

If you happen to build any game-like experience with this, please send me a [tweet](https://twitter.com/jussienroos).

## License

This codebase is released under the MIT License.