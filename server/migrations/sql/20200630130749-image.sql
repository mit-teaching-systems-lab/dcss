CREATE TABLE image (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK(name <> ''),
  size INT NOT NULL,
  url TEXT NOT NULL CHECK(url <> ''),
  user_id INT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE image_recognition (
  id SERIAL PRIMARY KEY,
  image_id INT REFERENCES image(id),
  classes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ
);

-- Up above
---
-- Down below

DROP TABLE image_recognition;
DROP TABLE image;
