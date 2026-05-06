-- CreateTable
CREATE TABLE "residence_change_requests" (
    "id" TEXT NOT NULL,
    "citizen_nni" TEXT,
    "old_address" TEXT NOT NULL,
    "old_city" TEXT NOT NULL,
    "new_address" TEXT NOT NULL,
    "new_city" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "effect_date" TIMESTAMP(3) NOT NULL,
    "move_date" TIMESTAMP(3) NOT NULL,
    "justificatifs" JSONB NOT NULL DEFAULT '[]',
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "residence_change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "casier_judiciaire_requests" (
    "id" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "national_number" TEXT NOT NULL,
    "profession" TEXT,
    "address" TEXT,
    "objet" TEXT NOT NULL,
    "urgence" TEXT NOT NULL DEFAULT 'Standard',
    "reference_number" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "casier_judiciaire_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cni_passeport_requests" (
    "id" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "reference_number" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cni_passeport_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impots_requests" (
    "id" TEXT NOT NULL,
    "numero_contribuable" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "annee_fiscale" TEXT NOT NULL,
    "montant_du" TEXT,
    "penalites" TEXT,
    "mode_paiement" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "impots_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" TEXT NOT NULL,
    "plaintiff_name" TEXT NOT NULL,
    "plaintiff_nni" TEXT,
    "plaintiff_phone" TEXT NOT NULL,
    "infraction_type" TEXT NOT NULL,
    "fact_date" TIMESTAMP(3) NOT NULL,
    "fact_time" TEXT,
    "fact_location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "preuves" JSONB NOT NULL DEFAULT '[]',
    "reference_number" TEXT,
    "status" "IncidentStatus" NOT NULL DEFAULT 'OUVERT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cni_block_requests" (
    "id" TEXT NOT NULL,
    "document_number" TEXT NOT NULL,
    "incident_date" TIMESTAMP(3) NOT NULL,
    "incident_location" TEXT,
    "motif" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reference_number" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cni_block_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "casier_judiciaire_requests_reference_number_key" ON "casier_judiciaire_requests"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "cni_passeport_requests_reference_number_key" ON "cni_passeport_requests"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "complaints_reference_number_key" ON "complaints"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "cni_block_requests_reference_number_key" ON "cni_block_requests"("reference_number");
