NPM=./node_modules/.bin

test: dependencies
	@$(NPM)/_mocha --reporter $(if $(or $(TEST),$(V)),spec,dot) \
		--slow 600 --timeout 2000 \
		--grep '$(TEST)'

lint: dependencies
	@$(NPM)/jshint --config .jshintrc lib test/*.js

dependencies:
	@if [ ! -d node_modules ]; then \
		echo "Installing dependencies.."; \
		npm install --silent; \
	fi

coverage: dependencies
	@$(NPM)/istanbul cover $(NPM)/_mocha -- --reporter spec

coverage-html: coverage
	@if [ -f coverage/lcov-report/index.html ]; then \
		open coverage/lcov-report/index.html; \
	fi;

clean:
	@rm -rf coverage compiled/* dist/validator_?.js

distclean: clean
	@rm -rf node_modules

min:
	@$(NPM)/browserify index.js -o dist/validator.js -s validator
	@$(NPM)/uglifyjs --ascii dist/validator.js > dist/validator_.js
	@cat lib/license.js dist/validator_.js > dist/validator.min.js
	@rm dist/validator_.js dist/validator.js

check: test
deps: dependencies

.PHONY: dependencies clean min
