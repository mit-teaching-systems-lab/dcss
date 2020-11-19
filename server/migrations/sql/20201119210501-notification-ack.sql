CREATE TABLE notification_ack (
  notification_id INT REFERENCES notification(id),
  user_id INT REFERENCES users(id),
  PRIMARY KEY (notification_id, user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Up above
---
-- Down below

DROP TABLE notification_ack;
