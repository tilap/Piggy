BIN = ./node_modules/.bin

h: help
help:
	@cat Makefile.help

i: install
install:
	npm prune
	npm install

r: reset
reset:
	rm -Rf node_modules

c: clean
clean:
	$(BIN)/gulp clean

b: build
build:
	$(BIN)/gulp build

web:
	$(BIN)/gulp web:dev

api:
	$(BIN)/gulp api:dev

module:
	$(BIN)/gulp create-module

unused:
	$(BIN)/gulp unusedPackages
