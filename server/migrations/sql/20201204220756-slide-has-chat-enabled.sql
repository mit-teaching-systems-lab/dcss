ALTER TABLE slide
  ADD COLUMN has_chat_enabled BOOLEAN DEFAULT FALSE;

---

ALTER TABLE slide
  DROP COLUMN has_chat_enabled;
