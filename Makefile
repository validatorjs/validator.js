NPM=./node_modules/.bin

test: dependencies
	@$(NPM)/_mocha \
		--reporter $(if $(or $(TEST),$(V)),spec,dot) \
		--slow 600 --timeout 2000 \
		--grep '$(TEST)'

lint: dependencies
	@$(NPM)/jshint --config .jshintrc \
		validator.js test/*.js

dependencies:
	@if [ ! -d node_modules ]; then \
		echo "Installing dependencies.."; \
		npm install --silent; \
	fi

coverage: dependencies
	@$(NPM)/istanbul cover $(NPM)/_mocha -- --reporter spec
	@open coverage/lcov-report/validator.js/validator.js.html

clean:
	@rm -rf coverage

distclean: clean
	@rm -rf node_modules

min:
	@$(NPM)/uglifyjs --compress --mangle --comments '/Copyright/' \
		< validator.js > validator.min.js

check: test
deps: dependencies

.PHONY: dependencies clean min
