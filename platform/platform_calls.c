#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <SDL/SDL.h>
#include "constants.h"
#include "platform_adapter.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

extern double get_current_time();
extern void get_text_file(const char *, load_text_data_callback_t *, void *);
extern void log_in_js(const char *);

static bool text_loaded = false;
static char * loaded_text = NULL;

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

    if (SDL_MUSTLOCK(screen)) {
        SDL_LockSurface(screen);
    }

    const uint8_t white[] = { 183, 182, 181 };
    const uint8_t black[] = { 14, 14, 13 };

    const Uint32 sdl_white = SDL_MapRGBA(screen->format, white[0], white[1], white[2], 255);
    const Uint32 sdl_black = SDL_MapRGBA(screen->format, black[0], black[1], black[2], 255);

    for (int i = 0; i < SCREEN_WIDTH * SCREEN_HEIGHT; ++i) {
        const Uint32 *color = buffer[i] ? sdl_white : sdl_black;
        int x = i % SCREEN_WIDTH;
        int y = i / SCREEN_WIDTH;
        *((Uint32 *)screen->pixels + y * SCREEN_WIDTH + x) = color;
    }
    if (SDL_MUSTLOCK(screen)) {
        SDL_UnlockSurface(screen);
    }
    
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

platform_time_t platform_current_time()
{
    return (platform_time_t)(get_current_time());
}

float platform_time_to_seconds(platform_time_t time)
{
    return (float)(((double)time) / 1000000.0);
}

void platform_print(const char *text)
{
    printf("%s", text);
}

void platform_read_text_file(const char *file_path, load_text_data_callback_t *callback, void *context)
{
    get_text_file(file_path, callback, context);
}

EMSCRIPTEN_KEEPALIVE
void read_text_callback(const char *file_path, const char *text_data, load_text_data_callback_t *callback, void *context)
{
    log_in_js("Got text file ");
    log_in_js(file_path);
    log_in_js(text_data);
    callback(file_path, text_data, context);
}
