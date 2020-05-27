#!/usr/bin/env bash




# This will copy data
#
# - FROM the ROSE database in teacher-moments-production
# - TO the ORANGE database in teacher-moments-staging
#
# This is used to copy production data into a
# staging app for testing purposes.
#
heroku pg:copy teacher-moments-production::ROSE ORANGE --app teacher-moments-staging;

# Once the copy has been made, we must delete the contents
# of the session table that were copied from the production
# db to the staging db.
#
heroku pg:psql --app teacher-moments-staging -c "DELETE FROM session";
