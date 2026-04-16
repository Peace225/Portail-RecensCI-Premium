-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CITIZEN', 'AGENT', 'ENTITY_ADMIN', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('MAIRIE', 'POLICE', 'ONECI', 'MINISTERE');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('EN_ATTENTE_VALIDATION', 'VALIDE', 'REJETE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MASCULIN', 'FEMININ');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LEGER', 'GRAVE', 'FATAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OUVERT', 'EN_COURS', 'FERME');

-- CreateTable
CREATE TABLE "institutions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InstitutionType" NOT NULL,
    "city" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AGENT',
    "institution_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citizens" (
    "id" TEXT NOT NULL,
    "nni" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT,
    "full_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "gender" "Gender",
    "address" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "validated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citizens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "birth_records" (
    "id" TEXT NOT NULL,
    "baby_first_name" TEXT NOT NULL,
    "baby_last_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "birth_time" TEXT,
    "weight" TEXT,
    "height" TEXT,
    "hospital_name" TEXT,
    "city_of_birth" TEXT NOT NULL,
    "mother_full_name" TEXT NOT NULL,
    "mother_nni" TEXT,
    "mother_profession" TEXT,
    "father_full_name" TEXT,
    "father_nni" TEXT,
    "father_profession" TEXT,
    "doctor_name" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "agent_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "birth_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "death_records" (
    "id" TEXT NOT NULL,
    "deceased_name" TEXT NOT NULL,
    "deceased_nni" TEXT,
    "death_date" TIMESTAMP(3) NOT NULL,
    "death_place" TEXT,
    "cause" TEXT,
    "declarant_name" TEXT NOT NULL,
    "declarant_nni" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "agent_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "death_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marriage_records" (
    "id" TEXT NOT NULL,
    "spouse1_name" TEXT NOT NULL,
    "spouse1_nni" TEXT,
    "spouse2_name" TEXT NOT NULL,
    "spouse2_nni" TEXT,
    "marriage_date" TIMESTAMP(3) NOT NULL,
    "marriage_place" TEXT,
    "witness_name" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "agent_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marriage_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divorce_records" (
    "id" TEXT NOT NULL,
    "spouse1_name" TEXT NOT NULL,
    "spouse2_name" TEXT NOT NULL,
    "divorce_date" TIMESTAMP(3) NOT NULL,
    "court_name" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "agent_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "divorce_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migration_records" (
    "id" TEXT NOT NULL,
    "citizen_name" TEXT NOT NULL,
    "citizen_nni" TEXT,
    "origin_city" TEXT NOT NULL,
    "destination_city" TEXT NOT NULL,
    "migration_type" TEXT NOT NULL,
    "migration_date" TIMESTAMP(3) NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "agent_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "migration_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_incidents" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "judicial_followup" BOOLEAN NOT NULL DEFAULT false,
    "status" "IncidentStatus" NOT NULL DEFAULT 'OUVERT',
    "reported_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_messages" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "from_admin" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "citizens_nni_key" ON "citizens"("nni");

-- CreateIndex
CREATE UNIQUE INDEX "citizens_email_key" ON "citizens"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "birth_records" ADD CONSTRAINT "birth_records_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "death_records" ADD CONSTRAINT "death_records_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marriage_records" ADD CONSTRAINT "marriage_records_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divorce_records" ADD CONSTRAINT "divorce_records_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "migration_records" ADD CONSTRAINT "migration_records_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_incidents" ADD CONSTRAINT "security_incidents_reported_by_id_fkey" FOREIGN KEY ("reported_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_messages" ADD CONSTRAINT "agent_messages_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
