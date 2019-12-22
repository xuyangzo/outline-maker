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
  outline_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (outline_id) REFERENCES outlines (id)
);

INSERT INTO novels
  (name, description, categories)
VALUES
  ('豪门特种兵之孤胆贼王', '什么几把书名', '豪门,孤儿,盗贼,特种兵');

INSERT INTO outlines
  (title, description, novel_id, scaling, fav, deleted)
VALUES
  ('默认模板', '默认介绍...', 1, '0.75', 0, 0);

INSERT INTO backgrounds
  (novel_id, title, content)
VALUES
  (1, '世界观', '整个世界一共分为三大世界，每个世界都是独立的一层，并且相互分隔，很难进行交流
每个世界都有自己的规则，并且受到太阳光照的幅度不一样，政权结构也不同，详见势力
这个世界上既有人类，也有魂兽。人类可以和魂兽签订魂约，之后便可以指挥魂兽
和魂兽签订魂约后，可以去巴比伦塔的地下一层进行考核，通过后会进行御兽使等级划分
基础生产力大部分是由魂兽提供的，而魂兽的地位就相当于是口袋妖怪里面的精灵');

INSERT INTO backgrounds
  (novel_id, title, content)
VALUES
  (1, '等级体系', '人人都恐怖如斯');

INSERT INTO backgrounds
  (novel_id, title, content)
VALUES
  (1, '圣者', '每一代圣者都是1男（领导者）+ 4女（后宫），仅仅这一个万年时代有，目的是为了拯救世界
每隔 1000 年，四大圣树便会重获新生，并且会有一代圣者诞生，故事开始时便是第九代圣者
每一代圣者大概都只存在了十年，然后四位女性便再次化作了圣树的种子，男性则是死于天魔下
圣者诞生的目的就是为了对抗破灭天魔，虽然也顺便处理过一些别的魂兽（比如说玛丽雷基）');

INSERT INTO locations
  (novel_id, name, intro, texture, location, controller)
VALUES
  (1, '天之塔', '三大世界的最高统治者，并且是所有种族的最高统治者', '一座纯白的塔', '第一世界中央', '天尊');

INSERT INTO characters
  (novel_id, outline_id, name, color, age, nickname, gender, height, identity, appearance, characteristics, experience)
VALUES
  (1, 1, '大佬', '#ffa39e', '18', '老狗', 0, '178', '世界树的传人', '丑,不知道咋说,jj还小', '高傲', '啥也没有');

INSERT INTO characters
  (novel_id, outline_id, name, color)
VALUES
  (1, 1, '不是我', '#ffbb96');

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