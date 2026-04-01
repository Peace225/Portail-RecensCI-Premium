import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsNumber } from 'class-validator';

// ─── BIRTH ───────────────────────────────────────────────────────────────────

export class CreateBirthDto {
  @ApiProperty({ example: 'Aya' }) @IsString() babyFirstName: string;
  @ApiProperty({ example: 'Koné' }) @IsString() babyLastName: string;
  @ApiProperty({ enum: ['MASCULIN', 'FEMININ'] }) @IsEnum(['MASCULIN', 'FEMININ']) gender: string;
  @ApiProperty({ example: '2024-03-15' }) @IsDateString() birthDate: string;
  @ApiPropertyOptional({ example: '08:30' }) @IsOptional() @IsString() birthTime?: string;
  @ApiPropertyOptional({ example: '3.2kg' }) @IsOptional() @IsString() weight?: string;
  @ApiPropertyOptional({ example: '50cm' }) @IsOptional() @IsString() height?: string;
  @ApiPropertyOptional({ example: 'CHU Cocody' }) @IsOptional() @IsString() hospitalName?: string;
  @ApiProperty({ example: 'Abidjan' }) @IsString() cityOfBirth: string;
  @ApiProperty({ example: 'Koné Marie' }) @IsString() motherFullName: string;
  @ApiPropertyOptional({ example: 'CI-0002-2024' }) @IsOptional() @IsString() motherNni?: string;
  @ApiPropertyOptional({ example: 'Commerçante' }) @IsOptional() @IsString() motherProfession?: string;
  @ApiPropertyOptional({ example: 'Koné Amadou' }) @IsOptional() @IsString() fatherFullName?: string;
  @ApiPropertyOptional({ example: 'CI-0003-2024' }) @IsOptional() @IsString() fatherNni?: string;
  @ApiPropertyOptional({ example: 'Ingénieur' }) @IsOptional() @IsString() fatherProfession?: string;
  @ApiPropertyOptional({ example: 'Dr. Bamba' }) @IsOptional() @IsString() doctorName?: string;
}

// ─── DEATH ───────────────────────────────────────────────────────────────────

export class CreateDeathDto {
  @ApiProperty({ example: 'Koné Amadou' }) @IsString() deceasedName: string;
  @ApiPropertyOptional({ example: 'CI-0003-2024' }) @IsOptional() @IsString() deceasedNni?: string;
  @ApiProperty({ example: '2024-03-20' }) @IsDateString() deathDate: string;
  @ApiPropertyOptional({ example: 'CHU Yopougon' }) @IsOptional() @IsString() deathPlace?: string;
  @ApiPropertyOptional({ example: 'Arrêt cardiaque' }) @IsOptional() @IsString() cause?: string;
  @ApiProperty({ example: 'Koné Marie' }) @IsString() declarantName: string;
  @ApiPropertyOptional({ example: 'CI-0002-2024' }) @IsOptional() @IsString() declarantNni?: string;
}

// ─── MARRIAGE ────────────────────────────────────────────────────────────────

export class CreateMarriageDto {
  @ApiProperty({ example: 'Koné Amadou' }) @IsString() spouse1Name: string;
  @ApiPropertyOptional({ example: 'CI-0003-2024' }) @IsOptional() @IsString() spouse1Nni?: string;
  @ApiProperty({ example: 'Diallo Fatou' }) @IsString() spouse2Name: string;
  @ApiPropertyOptional({ example: 'CI-0004-2024' }) @IsOptional() @IsString() spouse2Nni?: string;
  @ApiProperty({ example: '2024-04-01' }) @IsDateString() marriageDate: string;
  @ApiPropertyOptional({ example: 'Mairie Cocody' }) @IsOptional() @IsString() marriagePlace?: string;
  @ApiPropertyOptional({ example: 'Bamba Seydou' }) @IsOptional() @IsString() witnessName?: string;
}

// ─── DIVORCE ─────────────────────────────────────────────────────────────────

export class CreateDivorceDto {
  @ApiProperty({ example: 'Koné Amadou' }) @IsString() spouse1Name: string;
  @ApiProperty({ example: 'Diallo Fatou' }) @IsString() spouse2Name: string;
  @ApiProperty({ example: '2024-05-10' }) @IsDateString() divorceDate: string;
  @ApiPropertyOptional({ example: 'Tribunal de Première Instance Abidjan' }) @IsOptional() @IsString() courtName?: string;
}

// ─── MIGRATION ───────────────────────────────────────────────────────────────

export class CreateMigrationDto {
  @ApiProperty({ example: 'Koné Amadou' }) @IsString() citizenName: string;
  @ApiPropertyOptional({ example: 'CI-0003-2024' }) @IsOptional() @IsString() citizenNni?: string;
  @ApiProperty({ example: 'Bouaké' }) @IsString() originCity: string;
  @ApiProperty({ example: 'Abidjan' }) @IsString() destinationCity: string;
  @ApiProperty({ enum: ['INTERNE', 'INTERNATIONAL'], example: 'INTERNE' }) @IsEnum(['INTERNE', 'INTERNATIONAL']) migrationType: string;
  @ApiProperty({ example: '2024-06-01' }) @IsDateString() migrationDate: string;
}

// ─── SYNC BATCH ──────────────────────────────────────────────────────────────

export class SyncEventDto {
  @ApiProperty({ enum: ['birth', 'death', 'marriage', 'divorce', 'migration'] })
  type: string;

  @ApiProperty({ description: 'Données de l\'événement selon son type' })
  data: object;
}

export class SyncBatchDto {
  @ApiProperty({ type: [SyncEventDto] })
  events: SyncEventDto[];
}

// ─── STATUS UPDATE ───────────────────────────────────────────────────────────

export class UpdateStatusDto {
  @ApiProperty({ enum: ['EN_ATTENTE_VALIDATION', 'VALIDE', 'REJETE'] })
  @IsEnum(['EN_ATTENTE_VALIDATION', 'VALIDE', 'REJETE'])
  status: string;
}
