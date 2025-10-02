CREATE TABLE "associations"(
    "id" SERIAL NOT NULL,
    "name" TEXT NULL
);
ALTER TABLE
    "associations" ADD PRIMARY KEY("id");
CREATE TABLE "volunteers"(
    "id" SERIAL NOT NULL,
    "username" TEXT NULL,
    "password" TEXT NULL,
    "points" INTEGER NULL,
    "association_id" BIGINT NULL,
    "location" TEXT NULL,
    "email" TEXT NULL
);
ALTER TABLE
    "volunteers" ADD PRIMARY KEY("id");
CREATE TABLE "collects"(
    "id" SERIAL NOT NULL,
    "volunteer_id" BIGINT NULL,
    "location" TEXT NULL,
    "created_at" DATE NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "quantité" INTEGER NULL
);
ALTER TABLE
    "collects" ADD PRIMARY KEY("id");
CREATE TABLE "types"(
    "id" SERIAL NOT NULL,
    "megot" INTEGER NULL,
    "canne" INTEGER NULL,
    "plastique" INTEGER NULL,
    "conserve" INTEGER NULL,
    "canette" INTEGER NULL,
    "collect_id" BIGINT NULL
);
ALTER TABLE
    "types" ADD PRIMARY KEY("id");
ALTER TABLE
    "collects" ADD CONSTRAINT "collects_volunteer_id_foreign" FOREIGN KEY("volunteer_id") REFERENCES "volunteers"("id");
ALTER TABLE
    "types" ADD CONSTRAINT "types_collect_id_foreign" FOREIGN KEY("collect_id") REFERENCES "collects"("id");
ALTER TABLE
    "volunteers" ADD CONSTRAINT "volunteers_association_id_foreign" FOREIGN KEY("association_id") REFERENCES "associations"("id");




-- INSERTION DE DONNEES

INSERT INTO "associations" ("name") VALUES
('Green Earth'),
('Océan Propre'),
('Recycle+'),
('Eco Warriors');

-- Volunteers
INSERT INTO "volunteers" ("username", "password", "points", "association_id", "location", "email") VALUES
('alice', 'hashed_pw_1', 120, 1, 'Paris', 'alice@green.org'),
('bob', 'hashed_pw_2', 300, 2, 'Marseille', 'bob@ocean.org'),
('charlie', 'hashed_pw_3', 80, 1, 'Lyon', 'charlie@green.org'),
('diana', 'hashed_pw_4', 200, 3, 'Toulouse', 'diana@recycle.org'),
('eva', 'hashed_pw_5', 50, 4, 'Bordeaux', 'eva@eco.org');

-- Collects
INSERT INTO "collects" ("volunteer_id", "location", "created_at", "updated_at", "quantité") VALUES
(1, 'Seine - Quai de Bercy', '2025-09-01', '2025-09-01 10:15:00', 120),
(2, 'Plage du Prado', '2025-09-05', '2025-09-05 16:40:00', 300),
(3, 'Parc de la Tête d’Or', '2025-09-08', '2025-09-08 14:20:00', 80),
(4, 'Garonne - Pont Neuf', '2025-09-12', '2025-09-12 18:05:00', 200),
(5, 'Quais de Bordeaux', '2025-09-15', '2025-09-15 09:45:00', 50);

-- Types (détails des collectes)
INSERT INTO "types" ("megot", "canne", "plastique", "conserve", "canette", "collect_id") VALUES
(40, 10, 50, 5, 15, 1),   -- collecte Alice
(20, 30, 180, 30, 40, 2), -- collecte Bob
(10, 5, 60, 3, 2, 3),     -- collecte Charlie
(25, 15, 120, 20, 20, 4), -- collecte Diana
(5, 2, 35, 3, 5, 5);      -- collecte Eva