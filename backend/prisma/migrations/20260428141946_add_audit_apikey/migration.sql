-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'VALIDATE', 'REJECT', 'ACCESS_DENIED');

-- CreateEnum
CREATE TYPE "ApiKeyStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'REVOKED', 'EXPIRED');

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "user_email" TEXT,
    "user_role" TEXT,
    "action" "AuditAction" NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "description" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "key_prefix" TEXT NOT NULL,
    "organization_name" TEXT,
    "contact_email" TEXT,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "rate_limit" INTEGER NOT NULL DEFAULT 1000,
    "status" "ApiKeyStatus" NOT NULL DEFAULT 'ACTIVE',
    "expires_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_key_usage_logs" (
    "id" TEXT NOT NULL,
    "api_key_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_key_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs"("resource");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_hash_key" ON "api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "api_key_usage_logs_api_key_id_idx" ON "api_key_usage_logs"("api_key_id");

-- CreateIndex
CREATE INDEX "api_key_usage_logs_created_at_idx" ON "api_key_usage_logs"("created_at");

-- AddForeignKey
ALTER TABLE "api_key_usage_logs" ADD CONSTRAINT "api_key_usage_logs_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "api_keys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
