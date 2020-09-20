#include "test_scene.h"
#include <stdio.h>
#include <math.h>
#include <string.h>

typedef struct {
    GAME_OBJECT;
    Controls previous_controls;
    Vector2D offset;
    int32_t step;
} TestScene;

void test_scene_update(GameObject *scene, Number dt_ms)
{
    TestScene *self = (TestScene *)scene;

    LOG("Update test scene");

    self->step += nb_mul(nb_from_int(20), dt_ms) / 1000;
    if (self->step >= nb_from_int(256)) {
        self->step -= nb_from_int(256);
    }

    Controls controls = go_get_scene_manager(self)->controls;

    Number move_step = nb_mul(nb_from_int(100), dt_ms) / 1000;

    if (controls.button_left) {
        self->offset.x -= move_step;
    }
    if (controls.button_right) {
        self->offset.x += move_step;
    }
    if (controls.button_up) {
        self->offset.y -= move_step;
    }
    if (controls.button_down) {
        self->offset.y += move_step;
    }
    
    /*Number prev_crank = self->previous_controls.crank;
    Number curr_crank = go_get_scene_manager(self)->controls.crank;
    
    if (curr_crank - prev_crank > nb_from_int(180)) {
        prev_crank += nb_from_int(360);
    }
    if (curr_crank - prev_crank < -nb_from_int(180)) {
        curr_crank += nb_from_int(360);
    }
    
    self->letter_timer -= dt_ms;
    if (self->letter_timer <= nb_zero) {
        self->w_hello_label->visible_chars++;
        if (self->w_hello_label->visible_chars == self->w_hello_label->text_length) {
            self->letter_timer = 1000000;
        } else {
            self->letter_timer = 50000;
        }
        if (self->w_hello_label->visible_chars > self->w_hello_label->text_length) {
            self->w_hello_label->visible_chars = 0;
        }
    }
    
    self->scene_timer -= dt_ms;
    if (self->scene_timer <= nb_zero) {
        //scene_change(self->w_manager, test_scene_create(), st_swipe_left_to_right, 3000);
    }

    Number crankChange = curr_crank - prev_crank + self->leftover;
    Number change = crankChange * 256 / 360;
    self->leftover = crankChange - change * 360 / 256;

    GameObject *sprite = list_get(go_get_children(scene), 0);

    if (change) {
        if (self->crank_mode) {
            self->c_scale += nb_div(change, nb_from_int(60));
            if (self->c_scale >= nb_from_int(3)) {
                self->c_scale = nb_from_int(3);
            }
            if (self->c_scale < nb_half) {
                self->c_scale = nb_half;
            }
            sprite->scale = (Vector2D){ self->c_scale, self->c_scale };
        } else {
            self->c_rotation += change;
            if (self->c_rotation >= nb_from_int(360)) {
                self->c_rotation -= nb_from_int(360);
            }
            if (self->c_rotation < 0) {
                self->c_rotation += nb_from_int(360);
            }
            sprite->rotation = nb_to_radians(self->c_rotation);
        }
    }
    if (self->step >= nb_from_int(256)) {
        self->step -= nb_from_int(256);
    }
    if (self->step < nb_zero) {
        self->step += nb_from_int(256);
    }

    if (go_get_scene_manager(self)->controls.button_a && !self->previous_controls.button_a) {
        if (self->crank_mode) {
            self->crank_mode = 0;
            label_set_text(self->w_mode_label, "Crank: Rotate");
        } else {
            self->crank_mode = 1;
            label_set_text(self->w_mode_label, "Crank: Scale");
        }
    }
    if (go_get_scene_manager(self)->controls.button_b && !self->previous_controls.button_b) {
        if (self->w_rotate_label->rotate_and_scale) {
            self->w_rotate_label->rotate_and_scale = False;
            label_set_text(self->w_rotate_label, "Transform: False\nRow 2");
        } else {
            self->w_rotate_label->rotate_and_scale = True;
            label_set_text(self->w_rotate_label, "Transform: True\nRow 2");
        }
    }
    
    if (self->selected_dither < 0) {
        self->selected_dither = 3;
    } if (self->selected_dither > 3) {
        self->selected_dither = 0;
    }
    
    self->previous_controls = go_get_scene_manager(self)->controls;*/
}

void test_scene_fixed_update(GameObject *scene, Number dt_ms)
{
}

void test_scene_render(GameObject *scene, RenderContext *ctx)
{
    TestScene *self = (TestScene *)scene;

    Image *dither = get_image("dither_blue");
    ImageData *xor_data = image_data_xor_texture((Size2DInt){ SCREEN_WIDTH, SCREEN_HEIGHT }, (Vector2DInt){ nb_to_int(self->offset.x), nb_to_int(self->offset.y) }, 0);
    Image *xor = image_from_data(xor_data);
    image_render_dither(ctx, xor, dither, (Vector2DInt){ 0, 0 }, (Vector2DInt){ nb_to_int(self->step), nb_to_int(self->step) / 4 }, 0);
    destroy(xor);
    destroy(xor_data);
}

void test_scene_initialize(GameObject *scene)
{
    TestScene *self = (TestScene *)scene;

    LOG("Enter test scene");
    load_image_data("dither_blue", False, True);
}

void test_scene_start(GameObject *scene)
{
    
}

void test_scene_destroy(void *scene)
{
    go_destroy(scene);
}

char *test_scene_describe(void *scene)
{
    return platform_strdup("[]");
}

static GameObjectType TestSceneType = {
    { { "TestScene", &test_scene_destroy, &test_scene_describe } },
    &test_scene_initialize,
    &test_scene_start,
    &test_scene_update,
    &test_scene_fixed_update,
    &test_scene_render
};

GameObject *test_scene_create()
{
    GameObject *p_scene = go_alloc(sizeof(TestScene));
    p_scene->w_type = &TestSceneType;
    
    return p_scene;
}
