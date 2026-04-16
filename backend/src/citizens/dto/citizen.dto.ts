import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';

export enum Gender {
  MASCULIN = 'MASCULIN',
  FEMININ = 'FEMININ',
}

export class UpdateCitizenDto {
  @ApiPropertyOptional({ example: 'Kouassi Jean' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: 'citoyen@email.ci' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Abidjan' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '+225 07 00 00 00' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Cocody, Rue des Jardins' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class CitizenResponseDto {
  @ApiProperty({ example: 'uuid' }) id: string;
  @ApiProperty({ example: 'CI-0001-2024' }) nni: string;
  @ApiProperty({ example: 'Kouassi Jean' }) fullName: string;
  @ApiProperty({ example: 'citoyen@email.ci' }) email: string;
  @ApiProperty({ example: 'Abidjan' }) city: string;
  @ApiProperty({ example: 'VALIDE' }) status: string;
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' }) createdAt: string;
}

export class PaginatedCitizensDto {
  @ApiProperty({ type: [CitizenResponseDto] }) data: CitizenResponseDto[];
  @ApiProperty({ example: 120 }) total: number;
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 20 }) limit: number;
}
