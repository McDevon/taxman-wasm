CC=emcc
CFLAGS=-I. -v -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' -s EXPORTED_FUNCTIONS='["_main"]' --js-library web/taxmanLib.js

OUT_DIR=build
OBJ_DIR=obj
SRC_DIR=platform
COPY_DIR=web

MKDIR_P=mkdir -p
SRC=$(wildcard $(SRC_DIR)/*.c)
COPY_FILES=$(patsubst ${COPY_DIR}/%,${OUT_DIR}/%,$(wildcard ${COPY_DIR}/*))

.PHONY: all clean directories

all: directories $(COPY_FILES) game

clean:
	rm -rf ${OUT_DIR} ${OBJ_DIR} *.o

directories: ${OUT_DIR}

${OUT_DIR} ${OBJ_DIR}:
	${MKDIR_P} $@

$(OUT_DIR)/index.html: $(COPY_DIR)/index.html
$(OUT_DIR)/loader.js: $(COPY_DIR)/loader.js
$(OUT_DIR)/taxmanLib.js: $(COPY_DIR)/taxmanLib.js

-include $(OBJ:.o=.d)

$(OUT_DIR)/%:
	cp -f $< $@

game: sdl_test.o
	$(CC) $(CFLAGS) -o ${OUT_DIR}/core.js sdl_test.o
