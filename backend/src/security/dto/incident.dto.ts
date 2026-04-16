import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateIncidentDto {
  @ApiProperty({ example: 'Homicide', description: 'Type d\'incident' })
  @IsString()
  type: string;

  @ApiProperty({ enum: ['LEGER', 'GRAVE', 'FATAL'], example: 'GRAVE' })
  @IsEnum(['LEGER', 'GRAVE', 'FATAL'])
  severity: string;

  @ApiProperty({ example: 'Cocody, Rue des Jardins, Abidjan' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: 5.3599 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: -4.0083 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 'Altercation entre deux individus ayant dégénéré.' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  judicialFollowup?: boolean;
}

export class IncidentResponseDto {
  @ApiProperty({ example: 'uuid' }) id: string;
  @ApiProperty({ example: 'Homicide' }) type: string;
  @ApiProperty({ example: 'GRAVE' }) severity: string;
  @ApiProperty({ example: 'Cocody, Abidjan' }) location: string;
  @ApiPropertyOptional({ example: 5.3599 }) latitude?: number;
  @ApiPropertyOptional({ example: -4.0083 }) longitude?: number;
  @ApiProperty({ example: 'OUVERT' }) status: string;
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' }) createdAt: string;
}
