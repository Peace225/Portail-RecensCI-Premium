import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth, ApiTags, ApiQuery, ApiOperation,
  ApiResponse, ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CitizensService } from './citizens.service';
import { UpdateCitizenDto, CitizenResponseDto, PaginatedCitizensDto } from './dto/citizen.dto';

@ApiTags('👤 Citizens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('citizens')
export class CitizensController {
  constructor(private citizensService: CitizensService) {}

  @Get()
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Liste des citoyens', description: 'Recherche paginée avec filtre par nom ou NNI' })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche par nom ou NNI' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, type: PaginatedCitizensDto })
  findAll(@Query() query: any) {
    return this.citizensService.findAll(query);
  }

  @Get('nni/:nni')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Recherche par NNI' })
  @ApiParam({ name: 'nni', example: 'CI-0001-2024' })
  @ApiResponse({ status: 200, type: CitizenResponseDto })
  @ApiResponse({ status: 404, description: 'Citoyen introuvable' })
  findByNni(@Param('nni') nni: string) {
    return this.citizensService.findByNni(nni);
  }

  @Get(':id')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Détail d\'un citoyen' })
  @ApiParam({ name: 'id', description: 'UUID du citoyen' })
  @ApiResponse({ status: 200, type: CitizenResponseDto })
  @ApiResponse({ status: 404, description: 'Citoyen introuvable' })
  findOne(@Param('id') id: string) {
    return this.citizensService.findOne(id);
  }

  @Patch(':id/validate')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Valider un citoyen', description: 'Passe le statut à VALIDE' })
  @ApiParam({ name: 'id', description: 'UUID du citoyen' })
  @ApiResponse({ status: 200, type: CitizenResponseDto })
  validate(@Param('id') id: string) {
    return this.citizensService.validate(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Mettre à jour un citoyen' })
  @ApiParam({ name: 'id', description: 'UUID du citoyen' })
  @ApiResponse({ status: 200, type: CitizenResponseDto })
  update(@Param('id') id: string, @Body() body: UpdateCitizenDto) {
    return this.citizensService.update(id, body);
  }
}
