#!/usr/bin/env bash

# This will run a remote migration on staging
heroku run "cd server; ../node_modules/.bin/db-migrate up --config ./database.json -e staging" --app teacher-moments-staging
