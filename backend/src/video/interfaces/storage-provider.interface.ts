import type { Express } from "express"

export interface StorageConfig {
  type: "local" | "s3" | "cloudinary" | "firebase"
  bucketName?: string
  region?: string
  baseUrl?: string
  cdnEnabled?: boolean
  cdnUrl?: string
}

export interface UploadedFileInfo {
  url: string
  cdnUrl?: string
  key?: string
  size: number
  mimetype: string
  metadata?: Record<string, any>
}

export interface StorageProvider {
  uploadFile(file: Express.Multer.File, path: string): Promise<UploadedFileInfo>
  getSignedUrl(key: string, expiresIn?: number): Promise<string>
  deleteFile(key: string): Promise<boolean>
}

