#include "loading_scene.h"
#include "engine.h"
#include "gecko_scene.h"
#include "tilemap.h"
#include "game_data.h"
#include <stdio.h>
#include <math.h>

#include "bezier.h"

typedef struct {
    GAME_OBJECT;
    HashTable *assets_in_waiting;
    bool initialized;
} LoadingScene;

void loading_scene_run(LoadingScene *);

void loading_scene_asset_loaded_callback(const char *asset_name, bool success, void *context)
{
    LoadingScene *self = (LoadingScene*)context;
    
    int result = hashtable_remove(self->assets_in_waiting, asset_name);
    if (result) {
        LOG("Asset name not found: %s", asset_name);
    }
}

void load_resources(LoadingScene *self)
{
    GameData *data = game_data_create();
    go_get_scene_manager(self)->data = data;
    
    const char *images[] = {"dither_blue.png"};
    const char *sprite_sheets[] = {"demo_sprites", "gecko"};
    const char *grid_atlases[] = {"font4"};
    const Size2DInt grid_atlases_sizes[] = {(Size2DInt){ 8, 14 }};

    const size_t images_count = sizeof(images) / sizeof(char *);
    const size_t sprite_sheets_count = sizeof(sprite_sheets) / sizeof(char *);
    const size_t grid_atlases_count = sizeof(grid_atlases) / sizeof(char *);

    for (int i = 0; i < images_count; ++i) {
        hashtable_put(self->assets_in_waiting, images[i], NULL);
    }
    for (int i = 0; i < sprite_sheets_count; ++i) {
        hashtable_put(self->assets_in_waiting, sprite_sheets[i], NULL);
    }
    for (int i = 0; i < grid_atlases_count; ++i) {
        hashtable_put(self->assets_in_waiting, grid_atlases[i], NULL);
    }

    describe_debug_to_log(self->assets_in_waiting);

    for (int i = 0; i < images_count; ++i) {
        load_image_data(images[i], true, &loading_scene_asset_loaded_callback, self);
    }
    for (int i = 0; i < sprite_sheets_count; ++i) {
        load_sprite_sheet(sprite_sheets[i], &loading_scene_asset_loaded_callback, self);
    }
    for (int i = 0; i < grid_atlases_count; ++i) {
        load_grid_atlas(grid_atlases[i], grid_atlases_sizes[i], &loading_scene_asset_loaded_callback, self);
    }
}

void loading_scene_update(GameObject *scene, Number dt_ms)
{
    LoadingScene *self = (LoadingScene *)scene;
    
    if (!self->initialized && hashtable_count(self->assets_in_waiting) == 0) {
        loading_scene_run(self);
        self->initialized = true;
    }
}

void loading_scene_render(GameObject *scene, RenderContext *ctx)
{
    context_clear_white(ctx);
}

void endcall(void *go, void *unused)
{
    scene_change(go_get_scene_manager(go), gecko_scene_create(), st_fade_black, nb_from_double(800.0));
}

void loading_scene_set_draw_mode(void *obj, void *target_obj)
{
    Sprite *target = (Sprite *)target_obj;
    target->draw_mode = drawmode_rotate;
}

void loading_scene_run(LoadingScene *self)
{
    const Float time_fall = 0.4f;
    const Float time_start = 0.25f;
    const Float time_flatten = 0.29f;
    const Float time_jump = 0.7f;
    const Float time_wait = 1.f;
    
    get_main_render_context()->render_camera->position = vec(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);

    go_add_child(self, ({
        Sprite *sprite = sprite_create("logo_engine.png");
        sprite->position.x = nb_from_int(SCREEN_WIDTH / 2);
        sprite->position.y = nb_from_int(160);
        sprite->anchor.x = nb_half;
        sprite->anchor.y = nb_one;
        sprite->scale.x = nb_one;
        sprite->scale.y = nb_one;
        sprite->rotation = nb_zero;

        sprite->draw_mode = drawmode_scale;
        
        go_set_z_order(sprite, 1);
        
        go_add_component(sprite, act_create(action_sequence_create(({
            ArrayList *list = list_create();
            list_add(list, action_delay_create(time_start + time_fall));
            list_add(list, action_ease_out_create(action_scale_to_create(vec(nb_from_float(1.5f), nb_from_float(0.5f)), time_flatten)));
            list_add(list, action_ease_in_create(action_scale_to_create(vec(nb_one, nb_one), time_flatten)));
            list;
        }))));

        sprite;
    }));
    
    go_add_child(self, ({
        Float start_scale = 0.9f;
        
        Sprite *sprite = sprite_create("logo_taxman.png");
        sprite->position.x = nb_from_int(SCREEN_WIDTH / 2);
        sprite->position.y = nb_from_int(-1);
        sprite->anchor.x = nb_half;
        sprite->anchor.y = nb_one;
        sprite->scale.x = nb_from_float(start_scale);
        sprite->scale.y = nb_from_float(start_scale);
        sprite->rotation = nb_zero;

        sprite->draw_mode = drawmode_scale;

        go_set_z_order(sprite, 1);
        
        go_add_component(sprite, act_create(action_sequence_create(({
            //Float jump_bezier[4] = { .54f, 4.97f, 1.f, 1.31f };
            Float jump_bezier_table[] = { 0.000000f, 0.459692f, 0.871031f, 1.235496f, 1.554405f, 1.828919f, 2.060041f, 2.248616f, 2.395327f, 2.500677f, 2.564972f, 2.588284f, 2.570396f, 2.510713f, 2.408102f, 2.260611f, 2.064869f, 1.814598f, 1.495427f, 1.000000f };
            
            ArrayList *list = list_create();
            list_add(list, action_delay_create(time_start));
            list_add(list, action_ease_in_create(action_move_to_create(vec(nb_from_int(SCREEN_WIDTH / 2), nb_from_int(137)), time_fall)));
            list_add(list, action_ease_out_create(action_scale_to_create(vec(nb_from_float(1.5f), nb_from_float(0.5f)), time_flatten)));
            list_add(list, action_ease_in_create(action_scale_to_create(vec(nb_one, nb_one), time_flatten)));
            list_add(list, action_ease_bezier_prec_table_create(action_move_by_create(vec(nb_from_int(0), nb_from_int(-15)), time_jump), jump_bezier_table, 20));
            list_add(list, action_delay_create(time_wait));
            list_add(list, action_callback_create(endcall, NULL));
            list;
        }))));
        
        go_add_component(sprite, act_create(action_sequence_create(({
            ArrayList *list = list_create();
            list_add(list, action_delay_create(time_start + time_fall));
            list_add(list, action_ease_out_create(action_move_by_create(vec(nb_zero, nb_from_int(11)), time_flatten)));
            list_add(list, action_ease_in_create(action_move_by_create(vec(nb_zero, nb_from_int(-10)), time_flatten)));
            list;
        }))));

        go_add_component(sprite, act_create(action_sequence_create(({
            ArrayList *list = list_create();
            list_add(list, action_delay_create(time_start + time_fall + 2 * time_flatten));
            list_add(list, action_callback_create(&loading_scene_set_draw_mode, sprite));
            list_add(list, action_ease_out_create(action_rotate_to_create(nb_from_float((float)M_PI * 0.022f), time_jump)));
            list;
        }))));

        sprite;
    }));
}

void loading_scene_start(GameObject *scene)
{
    LoadingScene *self = (LoadingScene *)scene;
    load_resources(self);
}

void loading_scene_destroy(void *scene)
{
    LoadingScene *self = (LoadingScene *)scene;
    destroy(self->assets_in_waiting);
    go_destroy(scene);
}

char *loading_scene_describe(void *scene)
{
    return go_describe(scene);
}

static GameObjectType LoadingSceneType = {
    { { "LoadingScene", &loading_scene_destroy, &loading_scene_describe } },
    NULL,
    NULL,
    &loading_scene_start,
    &loading_scene_update,
    NULL,
    &loading_scene_render
};

GameObject *loading_scene_create()
{
    LoadingScene *p_scene = (LoadingScene*)go_alloc(sizeof(LoadingScene));
    
    p_scene->w_type = &LoadingSceneType;
    p_scene->assets_in_waiting = hashtable_create();
        
    return (GameObject *)p_scene;
}
