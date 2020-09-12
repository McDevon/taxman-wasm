#include <stdio.h>
#include <SDL/SDL.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

extern void start();

int main(int argc, char** argv) {
  start();

  return 0;
}

EMSCRIPTEN_KEEPALIVE
void step(int time) {

  SDL_Init(SDL_INIT_VIDEO);
  SDL_Surface *screen = SDL_SetVideoMode(300, 300, 32, SDL_SWSURFACE);

#ifdef TEST_SDL_LOCK_OPTS
  EM_ASM("SDL.defaults.copyOnLock = false; SDL.defaults.discardOnLock = true; SDL.defaults.opaqueFrontBuffer = false;");
#endif

  if (SDL_MUSTLOCK(screen)) SDL_LockSurface(screen);
  for (int i = 0; i < 256; i++) {
    for (int j = 0; j < 256; j++) {
#ifdef TEST_SDL_LOCK_OPTS
      int alpha = 255;
#else
      int alpha = (i+j) % 255;
#endif
      int color = i ^ j;
      *((Uint32*)screen->pixels + i * 300 + j) = SDL_MapRGBA(screen->format, color, color, color, alpha);
    }
  }
  if (SDL_MUSTLOCK(screen)) SDL_UnlockSurface(screen);
  SDL_Flip(screen); 

  SDL_Quit();
}

