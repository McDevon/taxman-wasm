#include <stdio.h>
#include <SDL/SDL.h>
#include "engine.h"
#include "loading_scene.h"
#include "platform_calls.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

extern void start();

int main(int argc, char** argv) {
  game_init(loading_scene_create());
  sdl_setup();
  start();
  return 0;
}

EMSCRIPTEN_KEEPALIVE
void step(double time, int left, int right, int up, int down, int a, int b, int menu) {
    Controls controls = { (uint32_t)0, (uint8_t)left, (uint8_t)right, (uint8_t)up, (uint8_t)down, (uint8_t)a, (uint8_t)b, (uint8_t)menu };
    Number delta = nb_from_double(time * 1000);
    game_step(delta, controls);
}
