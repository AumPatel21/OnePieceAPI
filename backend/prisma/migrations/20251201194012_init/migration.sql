-- CreateTable
CREATE TABLE "characters" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "japanese_name" TEXT,
    "df_id" INTEGER,
    "debut" TEXT,
    "affiliations" TEXT,
    "occupation" TEXT,
    "origin" TEXT,
    "residence" TEXT,
    "alias" TEXT,
    "epithet" TEXT,
    "status" TEXT,
    "age" TEXT,
    "birthday" TEXT,
    "blood_type" TEXT,
    "bounty" TEXT,
    "bounty_numeric" BIGINT,
    "url" TEXT,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devil_fruits" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "japanese_name" TEXT,
    "english_name" TEXT,
    "meaning" TEXT,
    "fruit_debut" TEXT,
    "usage_debut" TEXT,
    "type" TEXT,
    "previous_owner" TEXT,
    "current_owner" TEXT,
    "status" TEXT,
    "url" TEXT,

    CONSTRAINT "devil_fruits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_df_id_fkey" FOREIGN KEY ("df_id") REFERENCES "devil_fruits"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
