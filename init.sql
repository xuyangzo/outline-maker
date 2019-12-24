/**
 * sql reference for database configuration
 * cascade and set null are not included here
 */
DROP TABLE IF EXISTS trashes;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS outline_details;
DROP TABLE IF EXISTS characters;
DROP TABLE IF EXISTS timelines;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS outlines;
DROP TABLE IF EXISTS backgrounds;
DROP TABLE IF EXISTS novels;

CREATE TABLE novels
(
  id INTEGER PRIMARY KEY,
  name TEXT,
  description TEXT,
  categories TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE outlines
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  novel_id INTEGER,
  title TEXT,
  description TEXT,
  scaling TEXT,
  fav INTEGER,
  deleted INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels (id)
);

CREATE TABLE backgrounds
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  novel_id INTEGER,
  title TEXT,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels (id)
);

CREATE TABLE characters
(
  character_id INTEGER PRIMARY KEY AUTOINCREMENT,
  novel_id INTEGER,
  outline_id INTEGER,
  name TEXT,
  image TEXT,
  color TEXT,
  age TEXT,
  nickname TEXT,
  gender INTEGER,
  height TEXT,
  identity TEXT,
  appearance TEXT,
  characteristics TEXT,
  experience TEXT,
  deleted INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outline_id) REFERENCES outlines (id),
  FOREIGN KEY (novel_id) REFERENCES novels (id)
);

create table locations
(
  loc_id INTEGER PRIMARY KEY AUTOINCREMENT,
  novel_id INTEGER,
  name TEXT,
  image TEXT,
  intro TEXT,
  texture TEXT,
  location TEXT,
  controller TEXT,
  deleted INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels (id)
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
  novel_id INTEGER,
  outline_id INTEGER,
  character_id INTEGER,
  loc_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels (id),
  FOREIGN KEY (outline_id) REFERENCES outlines (id),
  FOREIGN KEY (character_id) REFERENCES characters (character_id),
  FOREIGN KEY (loc_id) REFERENCES locations (loc_id)
);