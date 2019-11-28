DROP TABLE IF EXISTS outlines;
DROP TABLE IF EXISTS outline_details;
DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS trash;
DROP TABLE IF EXISTS categories;

CREATE TABLE outlines
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT UNIQUE,
  description TEXT,
  category_id INTEGER,
  category_title TEXT,
  fav INTEGER,
  deleted INTEGER
);

CREATE TABLE outline_details
(
  outline_id INTEGER PRIMARY KEY,
  FOREIGN KEY (outline_id) REFERENCES outlines (id)
);

CREATE TABLE favorite
(
  fav_id INTEGER PRIMARY KEY,
  outline_id INTEGER,
  outline_title TEXT,
  FOREIGN KEY (outline_id) REFERENCES outlines (id)
);

CREATE TABLE trash
(
  trash_id INTEGER PRIMARY KEY AUTOINCREMENT,
  outline_id INTEGER,
  outline_title TEXT,
  FOREIGN KEY (outline_id) REFERENCES outlines (id)
);

CREATE TABLE categories
(
  id INTEGER PRIMARY KEY,
  category TEXT,
  outline_id INTEGER,
  outline_title TEXT,
  FOREIGN KEY (outline_id) REFERENCES outlines (id)
);

INSERT INTO outlines
  (title, description, category_id, category_title, fav, deleted)
VALUES
  ('test2', 'test6', 0, 0, 0, 0)