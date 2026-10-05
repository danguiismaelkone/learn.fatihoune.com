# FATIHOUNE Formation — deployment shortcuts (run on the server, in the cloned folder).
#   make env            create .env.production from the example (PAYLOAD_SECRET generated)
#   make deploy         build + (re)start + wait until the site answers   (alias: make run-dev)
#   ENV=preprod make …  same commands for pre-production (.env.preprod)
# Full procedure: deploy/README.md

ENV ?= production
ENV_FILE := .env.$(ENV)
COMPOSE ?= $(shell docker compose version >/dev/null 2>&1 && echo "docker compose" || echo docker-compose)
DC = $(COMPOSE) --env-file $(ENV_FILE) -f docker-compose.yml

.PHONY: help env check-env deploy run-dev wait ps logs restart stop export-content import-content backup-now

help: ## List the commands
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  make %-16s %s\n", $$1, $$2}'

env: ## Create .env.<ENV> from deploy/env.<ENV>.example with a generated PAYLOAD_SECRET
	@test ! -f $(ENV_FILE) || { echo "$(ENV_FILE) already exists: edit it instead."; exit 1; }
	@sed "s|^PAYLOAD_SECRET=$$|PAYLOAD_SECRET=$$(openssl rand -hex 32)|" deploy/env.$(ENV).example > $(ENV_FILE)
	@chmod 600 $(ENV_FILE)
	@echo "Created $(ENV_FILE). Fill in APP_PORT, SMTP_PASS and SEED_ADMIN_* (first start), then: make deploy ENV=$(ENV)"

check-env:
	@test -f $(ENV_FILE) || { echo "Missing $(ENV_FILE): run make env ENV=$(ENV)"; exit 1; }
	@grep -q '^PAYLOAD_SECRET=[^ #]' $(ENV_FILE) || { echo "PAYLOAD_SECRET is empty in $(ENV_FILE)"; exit 1; }
	@grep -q '^APP_PORT=[0-9]' $(ENV_FILE) || { echo "APP_PORT is empty in $(ENV_FILE) (free port, check: ss -ltn | grep :3018)"; exit 1; }

deploy: check-env ## Build the image, recreate the containers, wait until healthy
	$(DC) up -d --build --force-recreate
	@$(MAKE) --no-print-directory wait ENV=$(ENV)

run-dev: deploy ## Same as deploy (usual team command name)

wait: check-env ## Wait until the site answers /healthz (5 min max), then print the NPM target
	@i=0; until $(DC) exec -T app wget -qO- http://127.0.0.1:3000/healthz >/dev/null 2>&1; do \
	  i=$$((i+1)); if [ $$i -gt 60 ]; then echo "Not healthy after 5 minutes:"; $(DC) logs --tail 50 app; exit 1; fi; \
	  sleep 5; done
	@$(DC) ps
	@echo "OK. Nginx Proxy Manager target: http://$$(sed -n 's/^APP_BIND=\([0-9.]*\).*/\1/p' $(ENV_FILE) | grep . || echo 172.17.0.1):$$(sed -n 's/^APP_PORT=\([0-9]*\).*/\1/p' $(ENV_FILE))"

ps: check-env ## Container status
	$(DC) ps

logs: check-env ## Follow the application logs
	$(DC) logs -f --tail 100 app

restart: check-env ## Restart without rebuilding
	$(DC) restart app nginx_proxy

stop: check-env ## Stop the site (data is kept)
	$(DC) down

export-content: ## (local machine) Archive the local database + media for import-content
	./deploy/export-content.sh

import-content: check-env ## Replace the site's data with ARCHIVE=content-import/fatihoune-content-<date>.tar.gz
	@test -n "$(ARCHIVE)" || { echo "Usage: make import-content ENV=$(ENV) ARCHIVE=content-import/<file>.tar.gz"; exit 1; }
	COMPOSE="$(COMPOSE)" ./deploy/import-content.sh $(ENV) $(ARCHIVE)

backup-now: check-env ## Immediate backup of the database + media into backups/ (consistent SQLite snapshot)
	$(DC) exec -T backup sh -c 'stamp=$$(date +%F-%H%M); sqlite3 /data/fatihoune.db ".backup /backups/fatihoune-$$stamp.db" && tar -czf /backups/media-$$stamp.tar.gz -C /data media && echo "backups/*-$$stamp ok"'
