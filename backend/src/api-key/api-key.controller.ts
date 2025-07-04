import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { ApiKeyService, ApiKey, ApiKeyStatus } from './api-key.service';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { APIKeyGuard } from './api-key.guard';

class GenerateApiKeyDto {
  @IsNotEmpty()
  @IsString()
  ownerLabel: string;

  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

class AdminActionDto {
  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;
}

@Controller('api-keys')
export class ApiKeyController {
  private readonly logger = new Logger(ApiKeyController.name);

  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  generateApiKey(@Body() generateApiKeyDto: GenerateApiKeyDto): ApiKey {
    this.logger.log(
      `Received request to generate API key: ${JSON.stringify(generateApiKeyDto)}`,
    );
    return this.apiKeyService.generateApiKey(
      generateApiKeyDto.ownerLabel,
      generateApiKeyDto.isAdmin,
      generateApiKeyDto.expiresAt
        ? new Date(generateApiKeyDto.expiresAt)
        : undefined,
    );
  }

  @Post('revoke/:key')
  @HttpCode(HttpStatus.OK)
  revokeApiKey(
    @Param('key') key: string,
    @Body() adminActionDto: AdminActionDto,
  ): ApiKey {
    this.logger.log(
      `Received request to revoke API key ${key} (isAdmin: ${adminActionDto.isAdmin}).`,
    );
    return this.apiKeyService.revokeApiKey(key, adminActionDto.isAdmin);
  }

  @Get('all')
  getAllApiKeys(@Query() adminActionDto: AdminActionDto): ApiKey[] {
    this.logger.log(
      `Received request to get all API keys (isAdmin: ${adminActionDto.isAdmin}).`,
    );
    return this.apiKeyService.getAllApiKeys(adminActionDto.isAdmin);
  }

  @Get('protected')
  @UseGuards(APIKeyGuard)
  @HttpCode(HttpStatus.OK)
  getProtectedData(): { message: string } {
    this.logger.log('Accessing protected route.');
    return {
      message: 'This is protected data, accessible only with a valid API key!',
    };
  }
}
