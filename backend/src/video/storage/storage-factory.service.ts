import { Injectable } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import type { StorageProvider, StorageConfig } from "../interfaces/storage-provider.interface"
import type { LocalStorageProvider } from "./local-storage.provider"
import type { S3StorageProvider } from "./s3-storage.provider"

@Injectable()
export class StorageFactoryService {
  constructor(
    private configService: ConfigService,
    private localStorageProvider: LocalStorageProvider,
    private s3StorageProvider: S3StorageProvider,
  ) {}

  getStorageProvider(): StorageProvider {
    const storageType = this.configService.get<string>("STORAGE_TYPE", "local")

    switch (storageType) {
      case "s3":
        return this.s3StorageProvider
      case "local":
      default:
        return this.localStorageProvider
    }
  }

  getStorageConfig(): StorageConfig {
    const storageType = this.configService.get<string>("STORAGE_TYPE", "local")
    const cdnEnabled = this.configService.get<boolean>("CDN_ENABLED", false)
    const cdnUrl = this.configService.get<string>("CDN_URL", "")

    const config: StorageConfig = {
      type: storageType as any,
      cdnEnabled,
      cdnUrl,
    }

    if (storageType === "s3") {
      config.bucketName = this.configService.get<string>("AWS_S3_BUCKET")
      config.region = this.configService.get<string>("AWS_REGION", "us-east-1")
      config.baseUrl = `https://${config.bucketName}.s3.${config.region}.amazonaws.com`
    } else {
      config.baseUrl = this.configService.get<string>("BASE_URL", "http://localhost:3000")
    }

    return config
  }
}

