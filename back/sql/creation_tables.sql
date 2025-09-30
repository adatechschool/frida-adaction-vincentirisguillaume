CREATE TABLE "associations"(
    id BIGSERIAL PRIMARY KEY,
    "volunteer_id" BIGINT,
    "name" TEXT
);

CREATE TABLE "volunteers"(
    id BIGSERIAL PRIMARY KEY,
    "username" TEXT,
    "password" TEXT,
    "points" INTEGER,
    "collect_id" BIGINT,
    "location" TEXT
);


CREATE TABLE "collect"(
    id BIGSERIAL PRIMARY KEY,
    "type_id" BIGINT,
    "location" TEXT,
    "created_at" DATE,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE
);



CREATE TABLE "types"(
    id BIGSERIAL PRIMARY KEY,
    "megot" INTEGER,
    "canne" INTEGER,
    "plastique" INTEGER,
    "conserve" INTEGER,
    "canette" INTEGER
);

ALTER TABLE
    "collect" ADD CONSTRAINT "collect_type_id_foreign" FOREIGN KEY("type_id") REFERENCES "types"("id");
ALTER TABLE
    "volunteers" ADD CONSTRAINT "volunteers_collect_id_foreign" FOREIGN KEY("collect_id") REFERENCES "collect"("id");
ALTER TABLE
    "associations" ADD CONSTRAINT "associations_volunteer_id_foreign" FOREIGN KEY("volunteer_id") REFERENCES "volunteers"("id");




-- AJOUTER UNE COLONNE EMAIL DS TABLE volunteers

ALTER TABLE public.volunteers ADD COLUMN email TEXT;

-- MODIFIER L ETYPE DE DATE DE LA COLONNE PASSWORD

-- ALTER TABLE public.volunteers ALTER COLUMN password TYPE text


-- INSERTION DE DONNEES

INSERT INTO types (megot, canne, plastique, conserve, canette)
VALUES 
(50, 20, 30, 15, 25),
(100, 40, 60, 30, 50),
(75, 35, 45, 20, 40);

INSERT INTO collect (type_id, location, created_at, updated_at)
VALUES 
(1, 'Parc Central', '2023-01-15', '2023-01-15 10:30:00'),
(2, 'Plage du Sud', '2023-02-20', '2023-02-20 14:45:00'),
(3, 'Forêt du Nord', '2023-03-25', '2023-03-25 09:15:00');

INSERT INTO volunteers (username, password, points, collect_id, location, email)
VALUES 
('jean_propre', 'motdepasse123', 100, 1, 'Paris', 'jean@email.com'),
('marie_eco', 'ecolo456', 150, 2, 'Marseille', 'marie@email.com'),
('pierre_vert', 'vert789', 75, 3, 'Lyon', 'pierre@email.com');

INSERT INTO associations (volunteer_id, name)
VALUES 
(1, 'Nettoyons la Nature'),
(2, 'Océans Propres'),
(3, 'Forêts Vertes');