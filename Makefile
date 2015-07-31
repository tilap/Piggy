BIN = ./node_modules/.bin

help:
	@cat Makefile.help

# Install the dependancies
i: install
install:
	npm prune
	npm install

r: reset
reset:
	rm -Rf node_modules
	rm -Rf lib

# Clean generated files
c: clean
clean:
	$(BIN)/gulp clean

# Generate and compile everything needed
b: build
build:
	$(BIN)/gulp build

# Lauch watcher on dev sources and run required compilators
w: watch
watch:
	$(BIN)/gulp watch

n: new
new: clean reset install build

cb: clean build
bw: build watch
cbw: clean build watch

d: doc
doc:
	./node_modules/.bin/jsdoc --readme README.md -c .jsdoc

module:
	$(BIN)/gulp module
