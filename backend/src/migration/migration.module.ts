import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { MulterModule } from "@nestjs/platform-express"
import { MigrationController } from "./controllers/migration.controller"
import { JsonParserService } from "./services/json-parser.service"
import { MigrationService } from "./services/migration.service"
import { AdminGuard } from "./guards/admin.guard"
import { Puzzle } from "./entities/puzzle.entity" // Assuming this exists
import { diskStorage } from "multer"
import { extname } from "path"

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Puzzle]),
    MulterModule.register({
      storage: diskStorage({
        destination: "./uploads/migrations",
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`)
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype === "application/json" || extname(file.originalname) === ".json") {
          callback(null, true)
        } else {
          callback(new Error("Only JSON files are allowed"), false)
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  ],
  controllers: [MigrationController],
  providers: [JsonParserService, MigrationService, AdminGuard],
  exports: [JsonParserService, MigrationService],
})
export class MigrationModule {}
