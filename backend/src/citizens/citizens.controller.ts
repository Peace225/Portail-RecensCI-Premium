import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CitizensService } from './citizens.service';
import { UpdateCitizenDto, CitizenResponseDto, PaginatedCitizensDto } from './dto/citizen.dto';

@ApiTags('Citizens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('citizens')
export class CitizensController {
  constructor(private citizensService: CitizensService) {}

  @Post()
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Créer un citoyen (recensement)', description: 'Utilisé par CensusForm.tsx' })
  @ApiResponse({ status: 201, type: CitizenResponseDto })
  create(@Body() body: any) {
    return this.citizensService.create(body);
  }

  @Get()
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Liste des citoyens' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, type: PaginatedCitizensDto })
  findAll(@Query() query: any) {
    return this.citizensService.findAll(query);
  }

  @Get('pending')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Dossiers en attente de validation', description: 'Utilisé par CitizenFlux.tsx' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findPending(@Query() query: any) {
    return this.citizensService.findPending(query);
  }

  @Get('flagged')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Dossiers suspects / anomalies', description: 'Utilisé par CitizenValidation.tsx' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findFlagged(@Query() query: any) {
    return this.citizensService.findFlagged(query);
  }

  @Get('nni/:nni')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Recherche par NNI' })
  @ApiParam({ name: 'nni', example: 'CI-0001-2024' })
  @ApiResponse({ status: 200, type: CitizenResponseDto })
  findByNni(@Param('nni') nni: string) {
    return this.citizensService.findByNni(nni);
  }

  @Get(':id/profile')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN', 'CITIZEN')
  @ApiOperation({ summary: 'Profil complet + ménage', description: 'Utilisé par CitizenProfile.tsx' })
  @ApiParam({ name: 'id' })
  getProfile(@Param('id') id: string) {
    return this.citizensService.getProfile(id);
  }

  @Get(':id/requests')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'CITIZEN')
  @ApiOperation({ summary: 'Demandes de documents du citoyen', description: 'Utilisé par CitizenRequests.tsx' })
  @ApiParam({ name: 'id' })
  getRequests(@Param('id') id: string) {
    return this.citizensService.getRequests(id);
  }

  @Post(':id/requests')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'CITIZEN')
  @ApiOperation({ summary: 'Créer une demande de document' })
  @ApiParam({ name: 'id' })
  @ApiBody({ schema: { example: { type: 'Extrait de naissance', description: 'Pour usage scolaire' } } })
  createRequest(@Param('id') id: string, @Body() body: any) {
    return this.citizensService.createRequest(id, body);
  }

  @Get(':id/social-benefits')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'CITIZEN')
  @ApiOperation({ summary: 'Prestations sociales du citoyen', description: 'Utilisé par SocialSecurityView.tsx' })
  @ApiParam({ name: 'id' })
  getSocialBenefits(@Param('id') id: string) {
    return this.citizensService.getSocialBenefits(id);
  }

  @Get(':id')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Détail d\'un citoyen' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: CitizenResponseDto })
  findOne(@Param('id') id: string) {
    return this.citizensService.findOne(id);
  }

  @Patch(':id/validate')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Valider un citoyen' })
  @ApiParam({ name: 'id' })
  validate(@Param('id') id: string) {
    return this.citizensService.validate(id);
  }

  @Patch(':id/approve')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Approuver un dossier entrant', description: 'Utilisé par CitizenFlux.tsx' })
  @ApiParam({ name: 'id' })
  approve(@Param('id') id: string) {
    return this.citizensService.approve(id);
  }

  @Patch(':id/investigate')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Marquer un dossier comme suspect', description: 'Utilisé par CitizenValidation.tsx' })
  @ApiParam({ name: 'id' })
  investigate(@Param('id') id: string) {
    return this.citizensService.investigate(id);
  }

  @Patch(':id/address')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'CITIZEN')
  @ApiOperation({ summary: 'Changer l\'adresse d\'un citoyen', description: 'Utilisé par AddressChange.tsx' })
  @ApiParam({ name: 'id' })
  @ApiBody({ schema: { example: { address: 'Cocody, Rue des Jardins', city: 'Abidjan' } } })
  updateAddress(@Param('id') id: string, @Body() body: any) {
    return this.citizensService.updateAddress(id, body);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Mettre à jour un citoyen' })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() body: UpdateCitizenDto) {
    return this.citizensService.update(id, body);
  }
}
