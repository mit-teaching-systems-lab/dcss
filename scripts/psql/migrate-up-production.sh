#!/usr/bin/env bash

# This will run a remote migration on production
heroku run "cd server; ../node_modules/.bin/db-migrate up --config ./database.json -e prod" --app teacher-moments-production
