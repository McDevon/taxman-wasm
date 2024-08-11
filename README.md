# Taxman Wasm

This is the [Taxman Engine](https://github.com/mcdevon/taxman-engine) running in your browser.

The purpose of this project is to help me learn Wasm, as well as allow me to join game jams with [Playdate](http://play.date) games all the while allowing everyone to play even if they do not own the console.

Online demo is [available here](https://mcdevon.github.io/taxman-wasm/).

## Requirements

1. For compiling, [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) needs to be installed and in `PATH`
2. `make` is used as the build tool
3. The example uses Python 3 for serving the page locally. Any other means of setting up a server is equally adequate
4. To update the image assets, the [Pillow](https://pypi.org/project/Pillow/) library for python is required

## How to run

Make sure you have the submodule checked out.

Run in command line:

```
make
cd docs && python -m http.server
```

Then open a browser and head to [http://localhost:8000]()

## How to build

When developing a game, new assets and code directories can be added to the project using the provided scripts.

To update the makefile with the new code directories, run

```
make project
```

To build the game, run

```
make
```

This requires `python` and the Pillow library, which can be installed by running

```
python -m pip install pillow
```

Building the game will move all required files into the ´docs´ directory, which can then be served e.g. using the example method shown in the [example](#how-to-run).

The gecko demo that comes with the repository should be directly runnable by itself.

## Features

- Runs games built with Taxman Engine in browser
- Rendering the display
- Mapping of keys
- Crank controls mapped to keys
- Load asset files from server
- Amazing console visualisation
- Works on most mobile devices (i.e. smartphones)
- Audio effects using [howler.js](https://github.com/goldfire/howler.js)

## How to create a game

All game code is in the `game` directory. Custom scenes, game objects and game object components are added there. The first scene is creted in `main.c`, and passed to the `game_init` function. Examples of loading assets, creating game objects, changing scenes, and more can be found in `loading_scene.c` and `gecko_scene.c`.

Assets live in the `assets` directory and are moved to `docs` from there. Subdirectories of `assets` will be automatically turned into sprite sheets which the engine can read.

## Rough Backlog

- Migrate to SDL2 if it can be made more performant than SDL1

## Contributing

All contributions, especially issues, comments, and pull request are warmly welcome. This repository is maintained as a side project, and as such, it is unfortunately not possible to guarantee frequent updates.

If you happen to build any game-like experience with this, please send me a [tweet](https://twitter.com/jussienroos).

# Licenses:

### [howler.js](https://github.com/goldfire/howler.js)

```Copyright (c) 2013-2020 James Simpson and GoldFire Studios, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
