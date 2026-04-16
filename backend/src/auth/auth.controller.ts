import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

export class RegisterDto {
  email: string;
  password: string;
  fullName: string;
  nni?: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion', description: 'Retourne un JWT valable 7 jours' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Inscription citoyen', description: 'Utilisé par Register.tsx — crée un compte citoyen' })
  @ApiBody({ schema: { example: { email: 'nouveau@recensci.ci', password: 'MonMotDePasse123', fullName: 'Koné Aya', nni: 'CI-0099-2024' } } })
  @ApiResponse({ status: 201, description: 'Compte créé, JWT retourné' })
  @ApiResponse({ status: 409, description: 'Email ou NNI déjà utilisé' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur' })
  getMe(@Request() req) {
    return this.authService.getMe(req.user.id, req.user.role);
  }
}
