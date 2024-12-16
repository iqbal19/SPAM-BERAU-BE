import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  // private readonly uploadPath = path.join(__dirname, '..', 'uploads');
  private uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadBase64File(base64Data: string, folder: string): Promise<string> {
    try {
      // Ekstraksi tipe dan data base64
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new HttpException('Invalid base64 format', HttpStatus.BAD_REQUEST);
      }

      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      const fileExtension = this.getExtensionFromMimeType(mimeType);
      const fileName = `${uuidv4()}.${fileExtension}`;
      
      // Membuat path lengkap untuk subfolder
      const folderPath = path.join(this.uploadPath, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const filePath = path.join(folderPath, fileName);

      fs.writeFileSync(filePath, buffer);

      return path.join(folder, fileName); // Mengembalikan path relatif
    } catch (error) {
      throw new HttpException('File upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Metode untuk memperbarui file
  async updateFile(oldFilePath: string, base64Data: string, folder: string): Promise<string> {
    // Hapus file lama
    this.deleteFile(oldFilePath);
    // Upload file baru
    return this.uploadBase64File(base64Data, folder);
  }

  // Metode untuk menghapus file
  deleteFile(filePath: string): void {
    if (filePath) {
      const normalizedPath = filePath.replace(/^http:\/\/[^/]+\/uploads\//, '');
      const absolutePath = path.join(this.uploadPath, normalizedPath.replace(/\\/g, '/'));
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      } else {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  private getExtensionFromMimeType(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg': return 'jpg';
      case 'image/png': return 'png';
      case 'application/pdf': return 'pdf';
      default: return 'bin';
    }
  }
}
