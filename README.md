# Taxman Wasm

This is the [Taxman Engine](https://github.com/mcdevon/taxman-engine) running in your browser.

The purpose of this project is to help me learn Wasm, as well as allow me to join game jams with [Playdate](http://play.date) games all the while allowing everyone to play even if they do not own the console.

Online demo is [available here](https://mcdevon.github.io/taxman-wasm/).

## Requirements

1. For compiling, [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) needs to be installed and in `PATH`
2. `make` is used as the build tool
3. The example uses Python 3 for serving the page locally. Any other means of setting up a server is equally adequate

## Running

Make sure you have the submodule checked out.

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
- Crank controls mapped to keys
- Load asset files from server
- Amazing console visualisation

## Usage

All game code is in the `game` directory. Custom scenes, game objects and game object components are added there. The first scene is creted in `main.c`, and passed to the `game_init` function. Examples of loading assets, creating game objects, changing scenes, and more can be found in `loading_scene.c` and `gecko_scene.c`.

Assets live in the `assets` directory and are moved to `docs` from there.

## Rough Backlog

- Audio
- Mobile support
- Migrate to SDL2 if it can be made more performant than SDL1

## Contributing

All contributions, especially issues, comments, and pull request are warmly welcome. This repository is maintained as a side project, and as such, it is unfortunately not possible to guarantee frequent updates.

If you happen to build any game-like experience with this, please send me a [tweet](https://twitter.com/jussienroos).

## License

This codebase is released under the MIT License.