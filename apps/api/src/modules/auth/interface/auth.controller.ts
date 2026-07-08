import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import type { AuthResponse, AuthUser } from '@bankbridge/contracts';
import { AuditLogService } from '../../audit-logs/application/audit-log.service';
import { AuditAction } from '../../audit-logs/domain/audit-actions';
import { auditMetaFromRequest } from '../../audit-logs/interface/audit-request.util';
import { GetCurrentUserUseCase } from '../application/get-current-user.use-case';
import { LoginUseCase } from '../application/login.use-case';
import { LogoutUseCase } from '../application/logout.use-case';
import { RefreshTokenUseCase } from '../application/refresh-token.use-case';
import { RegisterUseCase } from '../application/register.use-case';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto, RefreshDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly audit: AuditLogService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new customer account' })
  async register(@Body() dto: RegisterDto, @Req() req: Request): Promise<AuthResponse> {
    const result = await this.registerUseCase.execute(dto);
    const meta = auditMetaFromRequest(req);
    await this.audit.record({
      actorId: result.user.id,
      action: AuditAction.AUTH_REGISTER,
      resourceType: 'user',
      resourceId: result.user.id,
      ...meta,
    });
    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate and receive access + refresh tokens' })
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<AuthResponse> {
    const result = await this.loginUseCase.execute(dto);
    const meta = auditMetaFromRequest(req);
    await this.audit.record({
      actorId: result.user.id,
      action: AuditAction.AUTH_LOGIN,
      resourceType: 'user',
      resourceId: result.user.id,
      ...meta,
    });
    return result;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and issue a new token pair' })
  refresh(@Body() dto: RefreshDto): Promise<AuthResponse> {
    return this.refreshUseCase.execute(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke all refresh tokens for the current user' })
  async logout(
    @CurrentUser('id') userId: string,
    @Req() req: Request,
  ): Promise<void> {
    await this.logoutUseCase.execute(userId);
    const meta = auditMetaFromRequest(req);
    await this.audit.record({
      actorId: userId,
      action: AuditAction.AUTH_LOGOUT,
      resourceType: 'user',
      resourceId: userId,
      ...meta,
    });
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  me(@CurrentUser('id') userId: string): Promise<AuthUser> {
    return this.getCurrentUserUseCase.execute(userId);
  }
}
