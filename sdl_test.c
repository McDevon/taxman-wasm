#include <stdio.h>
#include <SDL/SDL.h>
//#include "engine.h"
//#include "test_scene.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

extern void start();

int main(int argc, char** argv) {
  start();
  //game_init(test_scene_create());
  return 0;
}

EMSCRIPTEN_KEEPALIVE
void step(int time) {
  //Controls controls = { (uint32_t)0, (uint8_t)0, (uint8_t)0, (uint8_t)0, (uint8_t)0, (uint8_t)0, (uint8_t)0, (uint8_t)0 };
  //Number delta = nb_from_double(0.0333333333 * 1000);
  //game_step(delta, controls);

  SDL_Init(SDL_INIT_VIDEO);
    SDL_Surface *screen = SDL_SetVideoMode(300, 300, 32, SDL_SWSURFACE);

#ifdef TEST_SDL_LOCK_OPTS
    EM_ASM("SDL.defaults.copyOnLock = false; SDL.defaults.discardOnLock = true; SDL.defaults.opaqueFrontBuffer = false;");
#endif

    if (SDL_MUSTLOCK(screen))
        SDL_LockSurface(screen);
    for (int y = 0; y < 200; ++y)
    {
        for (int x = 0; x < 300; ++x)
        {
#ifdef TEST_SDL_LOCK_OPTS
            int alpha = 255;
#else
            int alpha = (y + x) % 255;
#endif
            int color = y ^ x;
            *((Uint32 *)screen->pixels + y * 300 + x) = SDL_MapRGBA(screen->format, color, color, color, alpha);
        }
    }
    if (SDL_MUSTLOCK(screen))
        SDL_UnlockSurface(screen);
    SDL_Flip(screen);

    SDL_Quit();
}

