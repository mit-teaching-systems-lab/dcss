-- Purge the earlier, unused notification table
DROP TABLE IF EXISTS notification;

CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    starts_at TIMESTAMPTZ DEFAULT NULL,
    expires_at TIMESTAMPTZ DEFAULT NULL,
    props JSONB,
    rules JSONB,
    type VARCHAR NOT NULL CHECK (
      type IN ('band', 'modal', 'toast')
    )
);

/*


DELETE FROM notification;

INSERT INTO notification (props, rules, type)
VALUES
  ('{"header": "Some notification title","content": "A description of the notification. This should be longer and more informative than the title.","className": "","type": "info","color": "pink", "icon": "","size": "large","timeout": null}', '{"session.isLoggedIn": true, "user.id": 2}', 'modal')
;


`props` describe the props that will be passed to the component

  {
    header: String
    content:
      contains the HTML that will be displayed in the
      notification. This is where action items must be placed, eg.:

       - link to a scenario run
       - link to a cohort
       - link to a scenario run within a cohort
       - link to settings
       - link to login
       - link to logout

    className: String
    type: error | info | success | warning
    color:
      red | orange | yellow | olive | green | teal | blue |
      violet | purple | pink | brown | grey | black
    icon: icon name,
    size: mini | tiny | small | large | fullscreen
    timeout: seconds until notification dissappears, defaults to
  }



`type` describe what kind of display type the notification is.

  band: a full width ribbon across the web page,
         persists until expiration, dismissal or timeout occurs
  modal: a modal pop up,
         persists until dismissed.
  toast: a toast notification,
         persists until dismissed, or timeout occurs



`rules` describe when/if a user sees a notification. `rules` are comprised of
object paths with values. Object paths must match paths that are found in the
Redux state store.

  Example rules:

  Show a notification to everyone that's in a cohort (id: 1):

  {
    "session.isLoggedIn": true,
    "cohort.id": 1,
  }


  Show a notification to facilitators in a cohort (id: 1):

  {
    "session.isLoggedIn": true,
    "cohort.id": 1,
    "cohort.roles": ["facilitator"]
  }


  Show a notification to visitors only:

  {
    "session.isLoggedIn": false,
  }


  Show a notification to a specific user (id: 999):

  {
    "session.isLoggedIn": true,
    "user.id": 999
  }


  Show a notification to a specific user (id: 999) when they are in a
  specific scenario (id: 42) :

  {
    "session.isLoggedIn": true,
    "user.id": 999,
    "scenario.id": 42
  }



*/
-- Up above
---
-- Down below

DROP TABLE notification;
