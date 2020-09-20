#include <string.h>
#include <stdio.h>

const char *sprites_txt = "sprites.png\nsize: 510, 45\nformat: RGBA8888\nfilter: Linear,Linear\nrepeat: none\nlogo_engine\n  rotate: false\n  xy: 278, 1\n  size: 231, 23\n  orig: 231, 23\n  offset: 0, 0\n  index: -1\nlogo_taxman\n  rotate: false\n  xy: 1, 1\n  size: 275, 43\n  orig: 275, 43\n  offset: 0, 0\n  index: -1\n";

char *platform_read_text_file(const char *file_path)
{
    if (strcmp(file_path, "sprites.txt") == 0) {
        return sprites_txt;
    }
    return NULL;
}

void platform_close_text_file(char *file_data) {}
