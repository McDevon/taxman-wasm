#include "test_scene.h"
#include <stdio.h>
#include <math.h>
#include <string.h>

static char *_dithers[] = { "dither_dot", "dither_diag", "dither_smoke" };

typedef struct {
    GAME_OBJECT;
    Label *w_hello_label;
    Label *w_rotate_label;
    Label *w_mode_label;
    Controls previous_controls;
    Number leftover;
    Number c_rotation;
    Number c_scale;
    Number letter_timer;
    Number scene_timer;
    int32_t step;
    int32_t selected_dither;
    int32_t crank_mode;
} TestScene;

void test_scene_update(GameObject *scene, Number dt_ms)
{
    TestScene *self = (TestScene *)scene;

    LOG("Update test scene");
    
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

    //Image *dither = get_image(_dithers[self->selected_dither]);
    ImageData *xor_data = image_data_xor_texture((Size2DInt){ SCREEN_WIDTH, SCREEN_HEIGHT }, (Vector2DInt){ 0, 0 }, 0);
    Image *xor = image_from_data(xor_data);
    //image_render_dither(ctx, xor, dither, 0, 0, nb_to_int(self->step), nb_to_int(self->step) / 4);
    image_render(ctx, xor, (Vector2DInt){ 0, 0 }, 0);
    //image_render_dither(ctx, xor, dither, (Vector2DInt){ 0, 0 }, (Vector2DInt){ 0, 0 }, 0);
    destroy(xor);
    destroy(xor_data);
}

void test_scene_initialize(GameObject *scene)
{
    TestScene *self = (TestScene *)scene;

    LOG("Enter test scene");
    
    self->previous_controls = go_get_scene_manager(self)->controls;
    self->selected_dither = 3;
    self->crank_mode = 0;
    self->c_scale = nb_one;
    self->c_rotation = nb_zero;
    self->letter_timer = 50000;
    self->scene_timer = 2500000;
    
    /*Sprite *wall = ({
        Sprite *wall = sprite_create("sapeli_slice");
        wall->position.x = nb_from_int(140);
        wall->position.y = nb_from_int(100);
        wall->anchor.x = nb_half;
        wall->anchor.y = nb_half;
        wall;
    });*/
    
    /*self->w_hello_label = ({
        Label *label = label_create("font", "Hello World!");
        label->position.x = nb_from_int(200);
        label->position.y = nb_from_int(140);
        label->anchor.x = nb_half;
        label->anchor.y = nb_half;
        label->rotate_and_scale = True;
        label;
    });
    
    describe_deubg_to_log(self->w_hello_label);
    
    go_add_child(self, self->w_hello_label);
    
    Sprite *wall2 = ({
        Sprite *wall = sprite_create("rock_0ld");
        wall->position.x = nb_from_int(0);
        wall->position.y = nb_from_int(-100);
        wall->anchor.x = nb_half;
        wall->anchor.y = nb_half;
        wall;
    });

    go_add_child(self->w_hello_label, wall2);
    
    self->w_rotate_label = ({
        Label *label = label_create("font", "Transform: True\nRow 2");
        label->position.x = nb_from_int(20);
        label->position.y = nb_from_int(0);
        label->anchor.x = nb_zero;
        label->anchor.y = nb_half;
        label->rotate_and_scale = True;
        label;
    });

    go_add_child(wall2, self->w_rotate_label);

    self->w_mode_label = ({
        Label *label = label_create("font", "Crank: Rotate");
        label->position.x = nb_from_int(SCREEN_WIDTH);
        label->position.y = nb_from_int(0);
        label->anchor.x = nb_one;
        label->anchor.y = nb_zero;
        label->rotate_and_scale = False;
        label;
    });

    go_add_child(self, self->w_mode_label);

    Sprite *wall3 = ({
        Sprite *wall = sprite_create("rock_0lud");
        wall->position.x = nb_from_int(0);
        wall->position.y = nb_from_int(40);
        wall->anchor.x = nb_half;
        wall->anchor.y = nb_half;
        wall;
    });

    go_add_child(wall2, wall3);*/
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
