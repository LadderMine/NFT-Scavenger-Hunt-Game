import { Injectable } from "@nestjs/common"
import type { StorageProvider, UploadedFileInfo } from "../interfaces/storage-provider.interface"
import type { ConfigService } from "@nestjs/config"
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import type { Express } from "express"

@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly s3Client: S3Client
  private readonly bucketName: string
  private readonly cdnEnabled: boolean
  private readonly cdnUrl: string
  private readonly region: string

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>("AWS_REGION", "us-east-1")
    this.bucketName = this.configService.get<string>("AWS_S3_BUCKET")
    this.cdnEnabled = this.configService.get<boolean>("CDN_ENABLED", false)
    this.cdnUrl = this.configService.get<string>("CDN_URL", "")

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
      },
    })
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<UploadedFileInfo> {
    const params = {
      Bucket: this.bucketName,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
    }

    await this.s3Client.send(new PutObjectCommand(params))

    const baseUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com`
    const fileUrl = `${baseUrl}/${path}`

    return {
      url: fileUrl,
      cdnUrl: this.cdnEnabled ? `${this.cdnUrl}/${path}` : undefined,
      key: path,
      size: file.size,
      mimetype: file.mimetype,
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    return getSignedUrl(this.s3Client, command, { expiresIn })
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      )
      return true
    } catch (error) {
      return false
    }
  }
}

