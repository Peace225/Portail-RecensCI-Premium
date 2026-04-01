import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CitizensService } from './citizens.service';

@ApiTags('Citizens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('citizens')
export class CitizensController {
  constructor(private citizensService: CitizensService) {}

  @Get()
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: any) {
    return this.citizensService.findAll(query);
  }

  @Get('nni/:nni')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  findByNni(@Param('nni') nni: string) {
    return this.citizensService.findByNni(nni);
  }

  @Get(':id')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  findOne(@Param('id') id: string) {
    return this.citizensService.findOne(id);
  }

  @Patch(':id/validate')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN')
  validate(@Param('id') id: string) {
    return this.citizensService.validate(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() body: any) {
    return this.citizensService.update(id, body);
  }
}
