#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <SDL/SDL.h>
#include "constants.h"
#include "platform_adapter.h"
#include "platform_types.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

extern double get_current_time();
extern void get_text_file(const char *, load_text_data_callback_t *, void *);
extern void get_image_file(const char *, load_image_data_callback_t *, void *);
extern void log_in_js(const char *);

static bool text_loaded = false;
static char * loaded_text = NULL;

SDL_Surface *screen;

void sdl_setup()
{
    SDL_Init(SDL_INIT_VIDEO);
    screen = SDL_SetVideoMode(SCREEN_WIDTH, SCREEN_HEIGHT, 32, SDL_SWSURFACE);
}

bool isPowerOfTwo(int value) {
    return (value != 0) && ((value & (value - 1)) == 0);
}

void platform_display_set_image(uint8_t *buffer, ScreenRenderOptions *options)
{
#ifdef TEST_SDL_LOCK_OPTS
    EM_ASM("SDL.defaults.copyOnLock = false; SDL.defaults.discardOnLock = true; SDL.defaults.opaqueFrontBuffer = false;");
#endif

    if (SDL_MUSTLOCK(screen)) {
        SDL_LockSurface(screen);
    }

    const uint8_t white[] = { 183, 182, 181 };
    const uint8_t black[] = { 14, 14, 13 };

    const Uint32 sdl_white = options->invert ? SDL_MapRGBA(screen->format, black[0], black[1], black[2], 255) : SDL_MapRGBA(screen->format, white[0], white[1], white[2], 255);
    const Uint32 sdl_black = options->invert ? SDL_MapRGBA(screen->format, white[0], white[1], white[2], 255) : SDL_MapRGBA(screen->format, black[0], black[1], black[2], 255);

    if (options->screen_dither && isPowerOfTwo(options->screen_dither->size.width) && isPowerOfTwo(options->screen_dither->size.height)) {
        uint32_t maskX = options->screen_dither->size.width - 1;
        uint32_t maskY = options->screen_dither->size.height - 1;
        uint32_t ditherWidth = options->screen_dither->size.width;
        uint8_t *ditherBuffer = options->screen_dither->buffer;
        for (uint32_t y = 0; y < SCREEN_HEIGHT; ++y) {
            uint32_t ditherYComp = (y & maskY) * ditherWidth;
            for (uint32_t x = 0; x < SCREEN_WIDTH; ++x) {
                uint32_t ditherX = x & maskX;
                uint32_t i = y * SCREEN_WIDTH + x;
                const uint8_t bufferValue = buffer[i];
                const Uint32 color = bufferValue && bufferValue >= ditherBuffer[ditherYComp + ditherX] ? sdl_white : sdl_black;
                *((Uint32 *)screen->pixels + y * SCREEN_WIDTH + x) = color;
            }
        }
    } else {
      for (int i = 0; i < SCREEN_WIDTH * SCREEN_HEIGHT; ++i) {
          const Uint32 color = buffer[i] > 128 ? sdl_white : sdl_black;
          int x = i % SCREEN_WIDTH;
          int y = i / SCREEN_WIDTH;
          *((Uint32 *)screen->pixels + y * SCREEN_WIDTH + x) = color;
      }
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
    log_in_js(text);
}

void platform_read_text_file(const char *file_path, load_text_data_callback_t *callback, void *context)
{
    get_text_file(file_path, callback, context);
}

void platform_load_image(const char *file_path, load_image_data_callback_t *callback, void *context)
{
    get_image_file(file_path, callback, context);
}

EMSCRIPTEN_KEEPALIVE
void read_text_callback(const char *file_path, const char *text_data, load_text_data_callback_t *callback, void *context)
{
    callback(file_path, text_data, context);
}

EMSCRIPTEN_KEEPALIVE
void read_image_callback(const char *file_path, const uint32_t width, const uint32_t height, const bool alpha, const uint8_t *image_data, load_image_data_callback_t *callback, void *context)
{
    callback(file_path, width, height, alpha, image_data, context);
}
