#include "loading_scene.h"
#include "engine.h"
#include "platformer_scene.h"
#include "text_selector_scene.h"
#include "test_scene.h"
#include "tilemap.h"
#include "game_data.h"
#include <stdio.h>
#include <math.h>

typedef struct {
    GAME_OBJECT;
    Number timer;
    Bool drawn;
    Bool transition_called;
    Sprite *w_logo_taxman;
    Sprite *w_logo_engine;
} LoadingScene;

void load_resources(LoadingScene *self)
{
    GameData *data = game_data_create();
    go_get_scene_manager(self)->data = data;
    /*load_image_data("dither_dot", False, True);
    load_image_data("dither_diag", False, True);
    load_image_data("dither_smoke", False, True);
    load_image_data("dither_blue", False, True);
    load_image_data("rock_01", False, True);
    load_sprite_sheet("tiles", False);
    //load_sprite_sheet("sprites", True);
    load_grid_atlas("font", True, (Size2DInt){ 8, 16 });
    load_tile_types("tiles.data", data->tile_dictionary);*/
}

void loading_scene_update(GameObject *scene, Number dt_ms)
{
    LoadingScene *self = (LoadingScene *)scene;

    self->timer += dt_ms;
    
    if (self->timer > nb_from_double(100.0) && !self->transition_called) {
        //scene_change(go_get_scene_manager(self), test_scene_create(), st_fade_black, 500);
        //scene_change(go_get_scene_manager(self), platformer_scene_create(), st_fade_black, nb_from_double(400.0));
        //scene_change(go_get_scene_manager(self), text_selector_scene_create(), st_fade_black, nb_from_double(400.0));
        self->transition_called = True;
    }
}

void loading_scene_fixed_update(GameObject *scene, Number dt_ms)
{
}

void loading_scene_render(GameObject *scene, RenderContext *ctx)
{
    context_clear_white(ctx);
    /*LoadingScene *self = (LoadingScene *)scene;
    if (!self->drawn) {
        LOG("render loading scene");
        Image *logo = get_image("logo_engine");
        image_render(ctx, logo, (Vector2DInt){ 0, 0 }, 0);
        self->drawn = True;
    }*/
}

void printcall(void *go, void *text)
{
    char *string = (char *)callback_context_get(text);
    LOG("Print: %s", string);
}

void endcall(void *go, void *unused)
{
    scene_change(go_get_scene_manager(go), platformer_scene_create(), st_fade_black, nb_from_double(800.0));
}

void timecall(void *go, void *text, Float time)
{
    char *string = (char *)callback_context_get(text);
    LOG("%s %.3f", string, time);
}

void loading_scene_initialize(GameObject *scene)
{
    LoadingScene *self = (LoadingScene *)scene;
    self->timer = nb_zero;
    self->drawn = False;
    self->transition_called = False;
    
    /*load_sprite_sheet("sprites", True);
    
    const Float time_fall = 0.4f;
    onst Float time_start = 0.25f;
    const Float time_flatten = 0.29f;
    const Float time_jump = 0.7f;
    const Float time_wait = 1.f;

    self->w_logo_engine = ({
        Sprite *sprite = sprite_create("logo_engine");
        sprite->position.x = nb_from_int(200);
        sprite->position.y = nb_from_int(160);
        sprite->anchor.x = nb_half;
        sprite->anchor.y = nb_one;
        sprite->scale.x = nb_one;
        sprite->scale.y = nb_one;
        sprite->rotation = nb_zero;

        sprite->rotate_and_scale = True;
        
        go_set_z_order(sprite, 1);
        
        go_add_component(sprite, act_create(action_sequence_create(({
            ArrayList *list = list_create();
            list_add(list, action_delay_create(time_start + time_fall));
            list_add(list, action_ease_out_create(action_scale_to_create(vec(nb_from_float(1.5f), nb_from_float(0.5f)), time_flatten)));
            list_add(list, action_ease_in_create(action_scale_to_create(vec(nb_one, nb_one), time_flatten)));
            list;
        }))));

        sprite;
    });
    
    self->w_logo_taxman = ({
        Float start_scale = 0.9f;
        
        Sprite *sprite = sprite_create("logo_taxman");
        sprite->position.x = nb_from_int(200);
        sprite->position.y = nb_from_int(-1);
        sprite->anchor.x = nb_half;
        sprite->anchor.y = nb_one;
        sprite->scale.x = nb_from_float(start_scale);
        sprite->scale.y = nb_from_float(start_scale);
        sprite->rotation = nb_zero;

        sprite->rotate_and_scale = True;
        
        go_set_z_order(sprite, 1);
        
        go_add_component(sprite, act_create(action_sequence_create(({
            Float jump_bezier[4] = { .54f, 4.97f, 1.f, 1.31f };
            
            ArrayList *list = list_create();
            list_add(list, action_delay_create(time_start));
            list_add(list, action_ease_in_create(action_move_to_create(vec(nb_from_int(200), nb_from_int(137)), time_fall)));
            list_add(list, action_ease_out_create(action_scale_to_create(vec(nb_from_float(1.5f), nb_from_float(0.5f)), time_flatten)));
            list_add(list, action_ease_in_create(action_scale_to_create(vec(nb_from_float(start_scale), nb_from_float(start_scale)), time_flatten)));
            list_add(list, action_ease_bezier_prec_create(action_move_by_create(vec(nb_from_int(0), nb_from_int(-15)), time_jump), jump_bezier, 20));
            list_add(list, action_delay_create(time_wait));
            list_add(list, action_callback_create(endcall, NULL));
            list;
        }))));
        
        go_add_component(sprite, act_create(action_sequence_create(({
            ArrayList *list = list_create();
            list_add(list, action_delay_create(time_start + time_fall));
            list_add(list, action_ease_out_create(action_move_by_create(vec(nb_zero, nb_from_int(11)), time_flatten)));
            list_add(list, action_ease_in_create(action_move_by_create(vec(nb_zero, nb_from_int(-10)), time_flatten)));
            list_add(list, action_scale_to_create(vec(nb_one, nb_one), time_jump));
            list;
        }))));

        go_add_component(sprite, act_create(action_sequence_create(({
            ArrayList *list = list_create();
            list_add(list, action_delay_create(time_start + time_fall + 2 * time_flatten));
            list_add(list, action_ease_out_create(action_rotate_to_create(nb_from_float((float)M_PI * 0.022f), time_jump)));
            list;
        }))));

        sprite;
    });
    
    go_add_child(self, self->w_logo_engine);
    go_add_child(self, self->w_logo_taxman);*/
}

void loading_scene_start(GameObject *scene)
{
    LoadingScene *self = (LoadingScene *)scene;
    load_resources(self);
}

void loading_scene_destroy(void *scene)
{
    go_destroy(scene);
}

char *loading_scene_describe(void *scene)
{
    return go_describe(scene);
}

static GameObjectType LoadingSceneType = {
    { { "LoadingScene", &loading_scene_destroy, &loading_scene_describe } },
    &loading_scene_initialize,
    &loading_scene_start,
    &loading_scene_update,
    &loading_scene_fixed_update,
    &loading_scene_render
};

GameObject *loading_scene_create()
{
    GameObject *p_scene = go_alloc(sizeof(LoadingScene));
    
    p_scene->w_type = &LoadingSceneType;
    
    return p_scene;
}
