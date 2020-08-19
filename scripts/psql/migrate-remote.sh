#!/usr/bin/env bash

YESNO="yes no";

PS3="
Migrate all (by number)?:
"
select MIGRATE_ALL in $YESNO
do
    if [[ -z "$MIGRATE_ALL" ]]; then
      echo "Invalid selection, please try again."
    else
      break;
    fi;

done


if [[ "$MIGRATE_ALL" = "no" ]]; then
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
fi;


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


if [[ "$MIGRATE_ALL" = "no" ]]; then
  TARGET="$PIPELINE-$STAGE";
  echo "db-migrate $DIRECTION, on $TARGET";

  # This will run a remote migration on staging
  heroku run "cd server; ../node_modules/.bin/db-migrate $DIRECTION --config ./database.json -e staging" --app $TARGET
else

  echo "db-migrate $DIRECTION on interpret-me-staging";
  heroku run "cd server; ../node_modules/.bin/db-migrate $DIRECTION --config ./database.json -e staging" --app interpret-me-staging;

  echo "db-migrate $DIRECTION on interpret-me-production";
  heroku run "cd server; ../node_modules/.bin/db-migrate $DIRECTION --config ./database.json -e staging" --app interpret-me-production;

  echo "db-migrate $DIRECTION on teacher-moments-staging";
  heroku run "cd server; ../node_modules/.bin/db-migrate $DIRECTION --config ./database.json -e staging" --app teacher-moments-staging;

  echo "db-migrate $DIRECTION on teacher-moments-production";
  heroku run "cd server; ../node_modules/.bin/db-migrate $DIRECTION --config ./database.json -e staging" --app teacher-moments-production;
fi;



