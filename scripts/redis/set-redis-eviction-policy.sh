#!/usr/bin/env bash

heroku redis:maxmemory --policy allkeys-lru -a teacher-moments-staging;
heroku redis:maxmemory --policy allkeys-lru -a teacher-moments-production;
heroku redis:maxmemory --policy allkeys-lru -a interpret-me-staging;
heroku redis:maxmemory --policy allkeys-lru -a interpret-me-production;
