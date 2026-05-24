import api from './api';

export interface UploadedFile {
  id: string;
  url: string;
  size: number;
  type: string;
  original_filename: string;
  mime_type?: string;
  uploaded_at?: string;
}

interface MultipleUploadResponse {
  files: UploadedFile[];
}

class UploadService {
  /**
   * Загрузка одного фото
   * POST /api/v1/uploads/photo
   */
  async uploadPhoto(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<UploadedFile>('/uploads/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Загрузка нескольких фото одним запросом
   * POST /api/v1/uploads/photos
   */
  async uploadMultiplePhotos(files: File[]): Promise<UploadedFile[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post<MultipleUploadResponse>('/uploads/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.files;
  }

  /**
   * Получение пре-подписанного URL для файла
   * GET /api/v1/uploads/{file_id}/url
   */
  async getFileUrl(id: string, expires: number = 3600): Promise<string> {
    const response = await api.get(`/uploads/${id}/url`, {
      params: { expires }
    });
    return response.data.url;
  }

  /**
   * Получение URL для превью (с кэшированием)
   */
  async getFilePreviewUrl(id: string): Promise<string> {
    try {
      return await this.getFileUrl(id);
    } catch (err) {
      console.error('Failed to get presigned URL:', err);
      // Fallback: прямой URL (может не работать, если бакет приватный)
      return `http://localhost:9000/uploads/${id}`;
    }
  }

  /**
   * Получение информации о файле
   * GET /api/v1/uploads/{file_id}
   */
  async getFileInfo(id: string): Promise<UploadedFile> {
    const response = await api.get<UploadedFile>(`/uploads/${id}`);
    return response.data;
  }

  /**
   * Удаление фото
   * DELETE /api/v1/uploads/{file_id}
   */
  async deleteFile(id: string): Promise<void> {
    await api.delete(`/uploads/${id}`);
  }
}

export default new UploadService();