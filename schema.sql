CREATE TABLE devil_fruits (
    id SERIAL PRIMARY KEY,
    name TEXT,
    japanese_name TEXT,
    english_name TEXT,
    meaning TEXT,
    fruit_debut TEXT,
    usage_debut TEXT,
    type TEXT,
    status TEXT,
    url TEXT
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name TEXT,
    japanese_name TEXT,
    devil_fruit_id INT REFERENCES devil_fruits(id),
    debut TEXT,
    affiliations TEXT,
    occupation TEXT,
    origin TEXT,
    residence TEXT,
    alias TEXT,
    epithet TEXT,
    status TEXT,
    age TEXT,
    birthday TEXT,
    blood_type TEXT,
    bounty TEXT,
    url TEXT,
);

