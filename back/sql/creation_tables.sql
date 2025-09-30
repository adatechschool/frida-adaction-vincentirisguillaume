CREATE TABLE "associations"(
    "id" BIGINT NOT NULL,
    "volunteer_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL
);
ALTER TABLE
    "associations" ADD PRIMARY KEY("id");
CREATE TABLE "volunteers"(
    "id" BIGINT NOT NULL,
    "username" TEXT NOT NULL,
    "password" UUID NOT NULL,
    "points" INTEGER NOT NULL,
    "collect_id" BIGINT NOT NULL,
    "location" TEXT NOT NULL
);
ALTER TABLE
    "volunteers" ADD PRIMARY KEY("id");
CREATE TABLE "collect"(
    "id" BIGINT NOT NULL,
    "type_id" BIGINT NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" DATE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "collect" ADD PRIMARY KEY("id");
CREATE TABLE "types"(
    "id" BIGINT NOT NULL,
    "megot" INTEGER NOT NULL,
    "canne" INTEGER NOT NULL,
    "plastique" INTEGER NOT NULL,
    "conserve" INTEGER NOT NULL,
    "canette" INTEGER NOT NULL
);
ALTER TABLE
    "types" ADD PRIMARY KEY("id");
ALTER TABLE
    "collect" ADD CONSTRAINT "collect_type_id_foreign" FOREIGN KEY("type_id") REFERENCES "types"("id");
ALTER TABLE
    "volunteers" ADD CONSTRAINT "volunteers_collect_id_foreign" FOREIGN KEY("collect_id") REFERENCES "collect"("id");
ALTER TABLE
    "associations" ADD CONSTRAINT "associations_volunteer_id_foreign" FOREIGN KEY("volunteer_id") REFERENCES "volunteers"("id");