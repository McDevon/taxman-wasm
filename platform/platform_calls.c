#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <SDL/SDL.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#define SCREEN_WIDTH 400
#define SCREEN_HEIGHT 240

SDL_Surface *screen;

void sdl_setup()
{
    SDL_Init(SDL_INIT_VIDEO);
    screen = SDL_SetVideoMode(SCREEN_WIDTH, SCREEN_HEIGHT, 32, SDL_SWSURFACE);

}

void platform_display_set_image(uint8_t *buffer)
{

#ifdef TEST_SDL_LOCK_OPTS
    EM_ASM("SDL.defaults.copyOnLock = false; SDL.defaults.discardOnLock = true; SDL.defaults.opaqueFrontBuffer = false;");
#endif

    if (SDL_MUSTLOCK(screen))
        SDL_LockSurface(screen);
    /*for (int x = 0; x < SCREEN_WIDTH; ++x)
    {
        for (int y = 0; y < SCREEN_HEIGHT; ++y)
        {
#ifdef TEST_SDL_LOCK_OPTS
            int alpha = 255;
#else
            int alpha = (y + x) % 255;
#endif
            int color = y ^ x;
            *((Uint32 *)screen->pixels + y * SCREEN_HEIGHT + x) = SDL_MapRGBA(screen->format, color, color, color, alpha);
        }
    }*/
    for (int i = 0; i < SCREEN_WIDTH * SCREEN_HEIGHT; ++i) {
        uint8_t color = buffer[i];
        int x = i % SCREEN_WIDTH;
        int y = i / SCREEN_WIDTH;
        *((Uint32 *)screen->pixels + y * SCREEN_WIDTH + x) = SDL_MapRGBA(screen->format, color, color, color, 255);
    }
    if (SDL_MUSTLOCK(screen))
        SDL_UnlockSurface(screen);
    SDL_Flip(screen);
}

void *platform_malloc(size_t size)
{
    return malloc(size);
}

void *platform_calloc(size_t count, size_t size)
{
    if (count > SIZE_MAX / size)
    {
        return NULL;
    }
    return calloc(count, size);
}

void *platform_realloc(void *ptr, size_t size)
{
    return realloc(ptr, size);
}

char *platform_strdup(const char *str)
{
    return strdup(str);
}

char *platform_strndup(const char *str, size_t size)
{
    return strndup(str, size);
}

void platform_free(void *ptr)
{
    free(ptr);
}
