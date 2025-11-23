CREATE TABLE
    devil_fruits (
        id SERIAL PRIMARY KEY,
        name TEXT,
        japanese_name TEXT,
        english_name TEXT,
        meaning TEXT,
        fruit_debut TEXT,
        usage_debut TEXT,
        type TEXT,
        previous_owner TEXT,
        current_owner TEXT,
        status TEXT,
        url TEXT
    );

CREATE TABLE
    characters (
        id SERIAL PRIMARY KEY,
        name TEXT,
        japanese_name TEXT,
        df_id INT REFERENCES devil_fruits (id) ON DELETE SET NULL,
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
        bounty_numeric BIGINT,
        url TEXT
    );