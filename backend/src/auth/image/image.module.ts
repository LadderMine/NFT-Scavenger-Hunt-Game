import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"

import { ImageController } from "./controllers/image.controller"
import { ImageService } from "./services/image.service"
import { StorageService } from "./services/storage.service"
import { ProcessorService } from "./services/processor.service"
import { Image } from "./entities/image.entity"
import { ImageRepository } from "./repositories/image.repository"
import { imageConfig } from "./config/image.config"

@Module({
  imports: [TypeOrmModule.forFeature([Image]), ConfigModule.forFeature(imageConfig)],
  controllers: [ImageController],
  providers: [ImageService, StorageService, ProcessorService, ImageRepository],
  exports: [ImageService],
})
export class ImageModule {}

