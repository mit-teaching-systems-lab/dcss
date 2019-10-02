CREATE SEQUENCE slide_default_order_seq;

ALTER TABLE slide
    RENAME COLUMN slide_order TO "order";

ALTER TABLE slide
    ALTER COLUMN "order" SET DEFAULT nextval('slide_default_order_seq');

ALTER TABLE slide
    ADD COLUMN title TEXT NOT NULL DEFAULT '';

-- Up above
---
-- Down below

ALTER TABLE SLIDE DROP COLUMN title;

ALTER TABLE slide
    ALTER COLUMN "order" DROP DEFAULT;

ALTER TABLE slide
    RENAME COLUMN "order" TO slide_order;

DROP SEQUENCE slide_default_order_seq;
