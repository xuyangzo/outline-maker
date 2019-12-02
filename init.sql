DROP TABLE IF EXISTS trashes;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS outline_details;
DROP TABLE IF EXISTS characters;
DROP TABLE IF EXISTS timelines;
DROP TABLE IF EXISTS outlines;

CREATE TABLE outlines
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  category_id INTEGER,
  category_title TEXT,
  scaling TEXT,
  fav INTEGER,
  deleted INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE characters
(
  character_id INTEGER PRIMARY KEY AUTOINCREMENT,
  outline_id INTEGER,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outline_id) REFERENCES outlines (id)
);

CREATE TABLE timelines
(
  timeline_id INTEGER PRIMARY KEY AUTOINCREMENT,
  outline_id INTEGER,
  time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outline_id) REFERENCES outlines (id)
);

CREATE TABLE outline_details
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  outline_id INTEGER,
  timeline_id INTEGER,
  character_id INTEGER,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outline_id) REFERENCES outlines (id),
  FOREIGN KEY (character_id) REFERENCES characters (character_id),
  FOREIGN KEY (timeline_id) REFERENCES timelines (timeline_id)
);

CREATE TABLE favorites
(
  fav_id INTEGER PRIMARY KEY AUTOINCREMENT,
  outline_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outline_id) REFERENCES outlines (id)
);

CREATE TABLE trashes
(
  trash_id INTEGER PRIMARY KEY AUTOINCREMENT,
  outline_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
  (title, description, category_id, category_title, scaling, fav, deleted)
VALUES
  ('默认模板', '默认介绍...', 0, 0, '1', 0, 0);

INSERT INTO characters
  (outline_id, name)
VALUES
  (1, '大佬');

INSERT INTO characters
  (outline_id, name)
VALUES
  (1, '不是我');

INSERT INTO timelines
  (outline_id, time)
VALUES
  (1, '1990年');

INSERT INTO timelines
  (outline_id, time)
VALUES
  (1, '1991年');

INSERT INTO timelines
  (outline_id, time)
VALUES
  (1, '1992年');

INSERT INTO outline_details
  (outline_id, timeline_id, character_id, content)
VALUES
  (1, 1, 1, '我杀人了');

INSERT INTO outline_details
  (outline_id, timeline_id, character_id, content)
VALUES
  (1, 1, 2, '我被杀了');

INSERT INTO outline_details
  (outline_id, timeline_id, character_id, content)
VALUES
  (1, 2, 1, '我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了');

  INSERT INTO outline_details
  (outline_id, timeline_id, character_id, content)
VALUES
  (1, 3, 2, '我tm又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了我又杀人了');