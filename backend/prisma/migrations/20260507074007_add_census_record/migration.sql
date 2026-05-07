-- CreateTable
CREATE TABLE "census_records" (
    "id" TEXT NOT NULL,
    "citizen_id" TEXT,
    "citizen_nni" TEXT,
    "address" TEXT,
    "quartier" TEXT,
    "commune" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "housing_type" TEXT,
    "ownership" TEXT,
    "household_size" INTEGER NOT NULL,
    "members" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'SOUMIS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "census_records_pkey" PRIMARY KEY ("id")
);
