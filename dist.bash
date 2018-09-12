#!/bin/bash
set -e

# Clean previous build
rm -rf dist
mkdir dist

# Compile the game
echo "Compiling game, with rollup..."
$(yarn bin)/rollup -c \
	-i src/index.js \
	-o dist/game.js
echo "Compiling game, with terser..."
$(yarn bin)/terser dist/game.js -o dist/game.js \
	--ecma 8 \
	--compress passes=4,pure_getters,unsafe,unsafe_arrows,unsafe_math \
	--mangle \
	--mangle-props keep_quoted \
	--module

echo "Inlining external resources..."
# Inline external resources
$(yarn bin)/html-inline \
	-i src/index.html \
	-o dist/index.html \
	-b dist

# Minify the HTML page
echo "Minifying html page..."
$(yarn bin)/html-minifier dist/index.html -o dist/index.html \
	--collapse-whitespace \
    --minify-css \
	--remove-attribute-quotes \
	--remove-optional-tags

echo "Creating zip archive..."
# Generate an optimized ZIP archive
zip -jqX9 dist/game.zip dist/index.html
echo "Recompressing zip archive..."
advzip -z4q -i 1000 dist/game.zip
echo "Done."
echo "-------"
TOTAL=`$(yarn bin)/gzip-size dist/game.zip --raw`
SUM=`echo $TOTAL - 13312 | bc`
echo $TOTAL bytes
echo $SUM bytes over

