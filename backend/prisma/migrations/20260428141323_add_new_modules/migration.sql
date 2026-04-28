-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('EXTRAIT_NAISSANCE', 'ACTE_MARIAGE', 'ACTE_DECES', 'CERTIFICAT_RESIDENCE', 'CERTIFICAT_NATIONALITE', 'CERTIFICAT_CELIBAT', 'CASIER_JUDICIAIRE');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('EN_ATTENTE', 'EN_TRAITEMENT', 'PRET', 'DELIVRE', 'REJETE');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('FAIBLE', 'MODERE', 'ELEVE', 'CRITIQUE');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'SURVEILLEE', 'RESOLUE');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('FAIBLE', 'NORMALE', 'HAUTE', 'URGENTE');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OUVERT', 'EN_COURS', 'RESOLU', 'FERME');

-- CreateTable
CREATE TABLE "customary_marriage_records" (
    "id" TEXT NOT NULL,
    "spouse1_name" TEXT NOT NULL,
    "spouse1_nni" TEXT,
    "spouse1_village" TEXT,
    "spouse2_name" TEXT NOT NULL,
    "spouse2_nni" TEXT,
    "spouse2_village" TEXT,
    "marriage_date" TIMESTAMP(3) NOT NULL,
    "ceremony_place" TEXT NOT NULL,
    "customary_chief" TEXT,
    "dot_description" TEXT,
    "witnesses" JSONB DEFAULT '[]',
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "agent_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customary_marriage_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "out_of_facility_birth_records" (
    "id" TEXT NOT NULL,
    "baby_first_name" TEXT NOT NULL,
    "baby_last_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "birth_place" TEXT NOT NULL,
    "birth_circumstance" TEXT,
    "mother_full_name" TEXT NOT NULL,
    "mother_nni" TEXT,
    "father_full_name" TEXT,
    "father_nni" TEXT,
    "declarant_name" TEXT NOT NULL,
    "declarant_relation" TEXT,
    "witnesses" JSONB DEFAULT '[]',
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "agent_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "out_of_facility_birth_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_requests" (
    "id" TEXT NOT NULL,
    "citizen_id" TEXT,
    "citizen_name" TEXT NOT NULL,
    "citizen_nni" TEXT,
    "type" "CertificateType" NOT NULL,
    "purpose" TEXT,
    "status" "CertificateStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "reference_number" TEXT,
    "processed_by" TEXT,
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificate_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_alerts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT,
    "description" TEXT NOT NULL,
    "affected_count" INTEGER,
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "reported_by" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "submitted_by" TEXT,
    "subject" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'NORMALE',
    "status" "TicketStatus" NOT NULL DEFAULT 'OUVERT',
    "assigned_to" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificate_requests_reference_number_key" ON "certificate_requests"("reference_number");

-- AddForeignKey
ALTER TABLE "customary_marriage_records" ADD CONSTRAINT "customary_marriage_records_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "out_of_facility_birth_records" ADD CONSTRAINT "out_of_facility_birth_records_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
