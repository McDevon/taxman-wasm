#include "gecko_scene.h"
#include "gecko.h"
#include "physics_world.h"
#include "physics_body.h"
#include <stdio.h>
#include <math.h>
#include <string.h>
#include "debug_draw.h"

typedef struct {
    GAME_OBJECT;
    Label *w_info_label;
    GameObject *w_head;
    DebugDraw *w_debug;
} GeckoScene;

Number timer = 0;

void gecko_scene_update(GameObject *scene, Number dt_ms)
{
    GeckoScene *self = (GeckoScene *)scene;
    timer += dt_ms;
    if (timer > nb_from_int(10000)) {
        profiler_schedule_end();
    }
}

void gecko_scene_fixed_update(GameObject *scene, Number dt_ms)
{
}

void gecko_scene_render(GameObject *scene, RenderContext *ctx)
{
    GeckoScene *self = (GeckoScene *)scene;

    context_clear_white(ctx);
}

void gecko_scene_initialize(GameObject *scene)
{
    GeckoScene *self = (GeckoScene *)scene;

    LOG("Enter gecko scene");
    self->w_info_label = ({
        Label *label = label_create("font_big_2", "Gecko World!");
        label->position.x = nb_from_int(2);
        label->position.y = nb_from_int(2);
        label->anchor.x = 0;
        label->anchor.y = 0;
        label->rotate_and_scale = false;
        label->invert = false;
        label;
    });
        
    go_add_child(self, self->w_info_label);
    
    self->w_debug = debugdraw_create();
    go_set_z_order(self->w_debug, 1000);
    
    self->w_head = ({
        Sprite *sprite = sprite_create("Gecko_Head-5");
        
        Animator *head_animation = animator_create();
        ArrayList *anim_idle = list_create();
        list_add(anim_idle, anim_frame_create("Gecko_Head-1", nb_from_int(400)));
        list_add(anim_idle, anim_frame_create("Gecko_Head-2", nb_from_int(200)));
        list_add(anim_idle, anim_frame_create("Gecko_Head-3", nb_from_int(300)));
        list_add(anim_idle, anim_frame_create("Gecko_Head-4", nb_from_int(350)));
        list_add(anim_idle, anim_frame_create("Gecko_Head-5", nb_from_int(450)));
        list_add(anim_idle, anim_frame_create("Gecko_Head-6", nb_from_int(1500)));
        animator_add_animation(head_animation, "idle", anim_idle);
        
        go_add_component(sprite, head_animation);
        
        animator_set_animation(head_animation, "idle");
        
        sprite->anchor.x = nb_zero;
        sprite->anchor.y = nb_half;
        sprite->position.x = nb_from_int(200);
        sprite->position.y = nb_from_int(120);
        sprite->rotate_and_scale = true;

        go_set_z_order(sprite, 5);
                
        GeckoCharacter *gecko_comp = gecko_char_create(self->w_debug);
        
        go_add_component(sprite, gecko_comp);
        
        (GameObject *)sprite;
    });

    go_add_child(self, self->w_head);
    go_add_child(self, self->w_debug);
}

void gecko_scene_start(GameObject *scene)
{
    profiler_schedule_start();
}

void gecko_scene_destroy(void *scene)
{
    go_destroy(scene);
}

char *gecko_scene_describe(void *scene)
{
    return platform_strdup("[]");
}

static GameObjectType GeckoSceneType = {
    { { "GeckoScene", &gecko_scene_destroy, &gecko_scene_describe } },
    &gecko_scene_initialize,
    NULL,
    &gecko_scene_start,
    &gecko_scene_update,
    &gecko_scene_fixed_update,
    &gecko_scene_render
};

GameObject *gecko_scene_create()
{
    GameObject *p_scene = go_alloc(sizeof(GeckoScene));
    p_scene->w_type = &GeckoSceneType;
    
    return p_scene;
}