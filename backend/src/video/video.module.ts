import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { MulterModule } from "@nestjs/platform-express"
import { Video } from "./entities/video.entity"
import { VideoService } from "./services/video.service"
import { VideoUploadService } from "./services/video-upload.service"
import { VideoStreamingService } from "./services/video-streaming.service"
import { VideoController } from "./controllers/video.controller"
import { LocalStorageProvider } from "./storage/local-storage.provider"
import { S3StorageProvider } from "./storage/s3-storage.provider"
import { StorageFactoryService } from "./storage/storage-factory.service"
import { VideoAccessGuard } from "./guards/video-access.guard"

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    ConfigModule,
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 100, // 100MB
      },
    }),
  ],
  controllers: [VideoController],
  providers: [
    VideoService,
    VideoUploadService,
    VideoStreamingService,
    LocalStorageProvider,
    S3StorageProvider,
    StorageFactoryService,
    VideoAccessGuard,
  ],
  exports: [VideoService, VideoUploadService, VideoStreamingService],
})
export class VideoModule {}

