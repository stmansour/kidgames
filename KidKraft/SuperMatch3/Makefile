.PHONY: lint lint-fix install clean help node_modules

# Default target - run linting
lint: node_modules
	@echo "Running ESLint..."
	npm run lint

# Ensure node_modules exists
node_modules: package.json
	@if [ ! -d "node_modules" ]; then \
		echo "Installing npm dependencies..."; \
		npm install; \
	fi

# Help target
help:
	@echo "Available targets:"
	@echo "  make (or make lint) - Run ESLint to check JavaScript syntax"
	@echo "  make lint-fix        - Run ESLint and automatically fix issues"
	@echo "  make install        - Install npm dependencies"
	@echo "  make clean          - Remove node_modules and package-lock.json"

# Install npm dependencies
install: node_modules
	@echo "Dependencies are installed."

# Run linting with auto-fix
lint-fix:
	@echo "Running ESLint with auto-fix..."
	npm run lint:fix

# Clean up generated files
clean:
	@echo "Cleaning up..."
	rm -rf node_modules
	rm -f package-lock.json

release:
	scp -i ~/.ssh/id_sman index.html sman:~/www/kidkraft/SuperMatch3/
	scp -i ~/.ssh/id_sman css/styles.css sman:~/www/kidkraft/SuperMatch3/css/
	scp -i ~/.ssh/id_sman js/app.js sman:~/www/kidkraft/SuperMatch3/js/
