/* eslint-disable prettier/prettier */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LogInProvider } from './providers/log-in.provider';
import { LogInDto } from './dto/log-in.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly logInProvider: LogInProvider,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  public async LogIn(logInDto: LogInDto, req: Request) {
    try {
      const result = await this.logInProvider.LogInToken(logInDto);

      // Log successful login
      if (typeof result === 'object' && 'user' in result) {
        await this.auditLogsService.logUserLogin(
          result.user.id.toString(),
          result.user.username,
          req.ip,
          true,
          { userAgent: req.headers['user-agent'] },
        );
      }

      return result;
    } catch (error) {
      // Log failed login attempt
      if (logInDto.username) {
        const user = await this.userService.FindByUsername(logInDto.username);
        if (user) {
          await this.auditLogsService.logUserLogin(
            user.id.toString(),
            user.username,
            req.ip,
            false,
            {
              error: error.message,
              userAgent: req.headers['user-agent'],
            },
          );
        } else {
          // Log attempt with non-existent username
          await this.auditLogsService.create({
            eventType: 'USER_AUTHENTICATION',
            username: logInDto.username,
            ipAddress: req.ip,
            action: 'LOGIN',
            status: 'FAILURE',
            resource: 'USER',
            metadata: {
              error: 'User not found',
              userAgent: req.headers['user-agent'],
            },
          });
        }
      }

      throw error;
    }
  }
}
