import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe, ClassSerializerInterceptor } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"
import { GlobalExceptionFilter } from "./common/exceptions/global-exception.filter"
import { Reflector } from "@nestjs/core"
import * as dotenv from "dotenv"
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const reflector = app.get(Reflector)

  // Global validation pipe with enhanced options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // Add detailed error messages
      exceptionFactory: (errors) => {
        console.log("Validation errors:", errors)
        return errors
      },
    }),
  )

  // Global serialization interceptor to exclude sensitive fields
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter())

  // Enable CORS with config
  app.enableCors(configService.get("appConfig.cors"))

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("NFT-Scavengers Hunt-Game API")
    .setDescription(
      "The NFT Scavengers Hunt game API provides endpoints for managing users, puzzles, NFTs, scores, answers, hints, and user progress. This API allows developers to build and integrate the game's functionality into their applications.",
    )
    .addServer("http://localhost:4000")
    .addTag("NFT-Scavengers Hunt-Game")
    .setBasePath("/api")
    .setTermsOfService("http://localhost:4000/terms-of-service")
    .setLicense("Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0.html")
    .setContact("Yusuf Tomilola", "http://localhost:4000/contact", "scavengers_hunt@game.com")
    .setVersion("1.0")
    // Adding a JWT authentication scheme to the Swagger configuration
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "Enter JWT token",
      in: "header",
    })
    .build()
  // Applying Swagger to the application
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("doc", app, document)

  // Add some startup logging
  console.log("🚀 Starting NFT Scavenger Hunt API...")
  console.log("📊 Database config:", {
    host: configService.get("database.host"),
    port: configService.get("database.port"),
    database: configService.get("database.name"),
  })

  await app.listen(process.env.PORT ?? 4000)
  console.log(`🎯 Application is running on: http://localhost:${process.env.PORT ?? 4000}`)
  console.log(`📚 Swagger documentation: http://localhost:${process.env.PORT ?? 4000}/doc`)
}
bootstrap()
