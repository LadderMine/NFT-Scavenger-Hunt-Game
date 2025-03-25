export class FileResponseDto {
    id: string;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    originalName?: string;
    createdAt: Date;
    url: string;
  }