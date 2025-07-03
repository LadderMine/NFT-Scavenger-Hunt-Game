import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class APIKeyGuard implements CanActivate {
  private readonly logger = new Logger(APIKeyGuard.name);

  constructor(private apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      this.logger.warn('API Key missing from headers.');
      throw new UnauthorizedException('API Key missing');
    }

    const isValid = this.apiKeyService.validateApiKey(apiKey);

    if (!isValid) {
      this.logger.warn(`Invalid API Key: ${apiKey}`);
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
