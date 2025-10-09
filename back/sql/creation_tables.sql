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
    "megot" INTEGER NULL,
    "canne" INTEGER NULL,
    "plastique" INTEGER NULL,
    "conserve" INTEGER NULL,
    "canette" INTEGER NULL
);
ALTER TABLE
    "collects" ADD PRIMARY KEY("id");
ALTER TABLE
    "collects" ADD CONSTRAINT "collects_volunteer_id_foreign" FOREIGN KEY("volunteer_id") REFERENCES "volunteers"("id") ON DELETE CASCADE;
ALTER TABLE
    "volunteers" ADD CONSTRAINT "volunteers_association_id_foreign" FOREIGN KEY("association_id") REFERENCES "associations"("id");

    -- Remplissage de la table associations
INSERT INTO associations (name) VALUES
('Surfrider'),
('Greenpeace'),
('WWF'),
('Zero Waste'),
('Sea Shepherd'),
('Les Petits Débrouillards');

-- Remplissage de la table volunteers
INSERT INTO volunteers (username, password, points, association_id, location, email) VALUES
('alice', 'abracadabra', 120, 1, 'Paris', 'alice@exemple.com'),
('bob', 'sesame', 80, 2, 'Lyon', 'bob@exemple.com'),
('charlie', 'alacazam', 60, 3, 'Marseille', 'charlie@exemple.com'),
('david', 'opensesamy', 150, 4, 'Toulouse', 'david@exemple.com'),
('emma', 'bisou', 90, 5, 'Nice', 'emma@exemple.com'),
('frank', 'chouchou', 200, 6, 'Bordeaux', 'frank@exemple.com');

-- Remplissage de la table collects
INSERT INTO collects (volunteer_id, location, created_at, updated_at, megot, canne, plastique, conserve, canette) VALUES
(1, 'Paris', '2025-10-01', '2025-10-01 10:00:00', 12, 5, 8, 3, 7),
(2, 'Lyon', '2025-10-02', '2025-10-02 11:00:00', 8, 2, 6, 1, 4),
(3, 'Marseille', '2025-10-03', '2025-10-03 12:00:00', 15, 7, 10, 5, 9),
(4, 'Toulouse', '2025-10-04', '2025-10-04 13:00:00', 5, 1, 3, 0, 2),
(5, 'Nice', '2025-10-05', '2025-10-05 14:00:00', 20, 10, 12, 6, 11),
(6, 'Bordeaux', '2025-10-06', '2025-10-06 15:00:00', 9, 3, 7, 2, 5);