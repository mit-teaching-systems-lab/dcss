#!/usr/bin/env bash

PIPELINES="interpret-me teacher-moments";
STAGES="staging production";

PS3="
Select pipeline to migrate (by number):
"
select PIPELINE in $PIPELINES
do
    if [[ -z "$PIPELINE" ]]; then
      echo "Invalid pipeline selection, please try again."
    else
      break;
    fi;

done

PS3="
Select app to migrate (by number):
"
select STAGE in $STAGES
do
    if [[ -z "$STAGE" ]]; then
      echo "Invalid stage selection, please try again."
    else
      break;
    fi;

done

DIRECTIONS="up down";
PS3="
Select migration direction (by number):
"
select DIRECTION in $DIRECTIONS
do
    if [[ -z "$DIRECTION" ]]; then
      echo "Invalid migration direction, please try again."
    else
      break;
    fi;
done

TARGET="$PIPELINE-$STAGE";
echo "db-migrate $DIRECTION, on $TARGET";

# This will run a remote migration on staging
heroku run "cd server; ../node_modules/.bin/db-migrate $DIRECTION --config ./database.json -e staging" --app $TARGET




