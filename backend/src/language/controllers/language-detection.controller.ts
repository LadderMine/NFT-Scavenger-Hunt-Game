import { Controller, Get, Req, Param } from "@nestjs/common"
import type { LanguageDetectionService } from "../services/language-detection.service"
import type { Request } from "express"
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiHeader } from "@nestjs/swagger"

@ApiTags("Language Detection")
@Controller("language/detect")
export class LanguageDetectionController {
  constructor(private readonly languageDetectionService: LanguageDetectionService) {}

  @ApiOperation({ summary: 'Detect language from request headers' })
  @ApiHeader({ name: 'Accept-Language', required: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the detected language based on Accept-Language header',
  })
  @Get()
  async detectLanguage(@Req() request: Request) {
    const acceptLanguage = request.headers['accept-language'] as string;
    const ipAddress = request.ip;
    
    let detectedLanguage;
    
    if (acceptLanguage) {
      detectedLanguage = await this.languageDetectionService.detectLanguageFromHeaders(acceptLanguage);
    } else if (ipAddress) {
      detectedLanguage = await this.languageDetectionService.detectLanguageFromIP(ipAddress);
    } else {
      // Fallback to default language
      detectedLanguage = await this.languageDetectionService.detectLanguageFromHeaders('');
    }
    
    return {
      success: true,
      data: {
        language: detectedLanguage,
        detectionMethod: acceptLanguage ? 'headers' : ipAddress ? 'ip' : 'default',
      },
    };
  }

  @ApiOperation({ summary: "Detect and save language preference for a user" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiHeader({ name: "Accept-Language", required: false })
  @ApiResponse({
    status: 200,
    description: "Detects and saves the language preference for the user",
  })
  @Get("user/:userId")
  async detectAndSaveUserLanguage(@Param('userId') userId: string, @Req() request: Request) {
    const acceptLanguage = request.headers["accept-language"] as string
    const ipAddress = request.ip

    const detectedLanguage = await this.languageDetectionService.detectAndSaveUserLanguage(
      userId,
      acceptLanguage,
      ipAddress,
    )

    return {
      success: true,
      data: {
        language: detectedLanguage,
        detectionMethod: acceptLanguage ? "headers" : ipAddress ? "ip" : "default",
        userId,
      },
    }
  }
}

