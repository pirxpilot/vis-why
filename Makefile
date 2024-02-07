NODE_BIN=./node_modules/.bin
PROJECT=vis-why

all: check

check: lint test

lint: node_modules
	$(NODE_BIN)/jshint index.js test benchmark

test: node_modules
	$(NODE_BIN)/mocha --require should test

benchmark: node_modules
	$(NODE_BIN)/matcha --reporter plain benchmark

node_modules: package.json
	yarn
	touch $@

distclean:
	rm -fr node_modules

.PHONY: clean distclean lint check all test benchmark
