export interface FileStorageService {
    uploadFile(file: Express.Multer.File): Promise<{
      filename: string;
      path: string;
      mimetype: string;
      size: number;
      originalName: string;
      storageType: string;
    }>;
    
    getFileUrl(path: string): string;
    
    deleteFile(path: string): Promise<void>;
  }

  export interface FileStorageService {
  uploadFile(file: Express.Multer.File): Promise<{
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    originalName: string;
    storageType: string;
  }>;
  
  getFileUrl(path: string): string;
  
  deleteFile(path: string): Promise<void>;
}