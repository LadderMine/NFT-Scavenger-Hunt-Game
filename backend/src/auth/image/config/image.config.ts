import { registerAs } from "@nestjs/config"
import * as path from "path"

export const imageConfig = registerAs("image", () => ({
  storage: {
    driver: process.env.IMAGE_STORAGE_DRIVER || "local", // 'local' or 's3'
    local: {
      storagePath: process.env.IMAGE_STORAGE_PATH || path.join(process.cwd(), "uploads/images"),
      servePath: process.env.IMAGE_SERVE_PATH || "images",
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      baseUrl: process.env.AWS_S3_BASE_URL,
    },
  },
  processing: {
    defaultQuality: Number.parseInt(process.env.IMAGE_DEFAULT_QUALITY || "80", 10),
    maxWidth: Number.parseInt(process.env.IMAGE_MAX_WIDTH || "2000", 10),
    maxHeight: Number.parseInt(process.env.IMAGE_MAX_HEIGHT || "2000", 10),
    defaultFormat: process.env.IMAGE_DEFAULT_FORMAT || "webp",
    thumbnails: {
      small: { width: 150, height: 150 },
      medium: { width: 300, height: 300 },
      large: { width: 600, height: 600 },
    },
  },
  limits: {
    fileSize: Number.parseInt(process.env.IMAGE_MAX_FILE_SIZE || "5242880", 10), // 5MB
    files: Number.parseInt(process.env.IMAGE_MAX_FILES || "10", 10),
  },
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
}))

export type ImageConfig = ReturnType<typeof imageConfig>

