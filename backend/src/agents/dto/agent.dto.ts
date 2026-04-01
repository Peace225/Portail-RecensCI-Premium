import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAgentDto {
  @ApiProperty({ example: 'nouvel.agent@recensci.ci' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Bamba Seydou' })
  @IsString()
  fullName: string;

  @ApiProperty({ enum: ['AGENT', 'ENTITY_ADMIN'], example: 'AGENT' })
  @IsEnum(['AGENT', 'ENTITY_ADMIN'])
  role: string;

  @ApiPropertyOptional({ example: 'inst-mairie-abidjan' })
  @IsOptional()
  @IsString()
  institutionId?: string;

  @ApiPropertyOptional({ example: 'MotDePasse@2024', description: 'Défaut: Recensci@2024' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'Votre accréditation a été renouvelée.' })
  @IsString()
  content: string;
}

export class AgentResponseDto {
  @ApiProperty({ example: 'uuid' }) id: string;
  @ApiProperty({ example: 'Bamba Seydou' }) fullName: string;
  @ApiProperty({ example: 'agent@recensci.ci' }) email: string;
  @ApiProperty({ example: 'AGENT' }) role: string;
  @ApiPropertyOptional() institution?: object;
}
