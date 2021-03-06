CC=emcc
CFLAGS=-I. -v -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
       -s EXPORTED_FUNCTIONS='["_main"]' \
	   -fsanitize=undefined \
	   --js-library web/taxmanLib.js \
	   -I taxman-engine/Engine/Actions/ \
	   -I taxman-engine/Engine/Components/ \
	   -I taxman-engine/Engine/Logic/ \
	   -I taxman-engine/Engine/Math/ \
	   -I taxman-engine/Engine/Render/ \
	   -I taxman-engine/Engine/Resources/ \
	   -I taxman-engine/Engine/Scene/ \
	   -I taxman-engine/Engine/Strings/ \
	   -I taxman-engine/Engine/Utils/ \
	   -I taxman-engine/Tools/Camera/ \
	   -I taxman-engine/Tools/Physics/ \
	   -I taxman-engine/Tools/Tilemap/ \
	   -I platform/ \
	   -I game/

OUT_DIR=docs
OBJ_DIR=obj
SRC_DIR=platform
COPY_DIR=web

MKDIR_P=mkdir -p
CSRC = $(wildcard platform/*.c) \
       $(wildcard taxman-engine/Engine/Actions/*.c) \
       $(wildcard taxman-engine/Engine/Components/*.c) \
       $(wildcard taxman-engine/Engine/Logic/*.c) \
       $(wildcard taxman-engine/Engine/Math/*.c) \
       $(wildcard taxman-engine/Engine/Render/*.c) \
       $(wildcard taxman-engine/Engine/Resources/*.c) \
       $(wildcard taxman-engine/Engine/Scene/*.c) \
       $(wildcard taxman-engine/Engine/Strings/*.c) \
       $(wildcard taxman-engine/Engine/Utils/*.c) \
       $(wildcard taxman-engine/Tools/Camera/*.c) \
       $(wildcard taxman-engine/Tools/Physics/*.c) \
       $(wildcard taxman-engine/Tools/Tilemap/*.c) \
       $(wildcard game/*.c) \
       $(wildcard assets/*.c)
OBJ = $(CSRC:.c=.o)
COPY_FILES=$(patsubst ${COPY_DIR}/%,${OUT_DIR}/%,$(wildcard ${COPY_DIR}/*))

.PHONY: all clean directories

all: directories $(COPY_FILES) game

clean:
	rm -rf ${OUT_DIR} ${OBJ_DIR} ${OBJ} *.o

directories: ${OUT_DIR}

${OUT_DIR} ${OBJ_DIR}:
	${MKDIR_P} $@

$(OUT_DIR)/index.html: $(COPY_DIR)/index.html
$(OUT_DIR)/loader.js: $(COPY_DIR)/loader.js
$(OUT_DIR)/taxmanLib.js: $(COPY_DIR)/taxmanLib.js

#-include $(OBJ:.o=.d)

$(OUT_DIR)/%:
	cp -f $< $@

game: $(OBJ) $(CSRC) main.o
	$(CC) $(CFLAGS) -o ${OUT_DIR}/core.js $(OBJ) main.o
