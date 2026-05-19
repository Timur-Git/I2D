import api from './api';

export interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  created_at: string;
}

class UploadService {
  async uploadPhoto(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/uploads/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadMultiplePhotos(files: File[]): Promise<UploadedFile[]> {
    const uploadPromises = files.map(file => this.uploadPhoto(file));
    return Promise.all(uploadPromises);
  }

  async getFileInfo(id: string): Promise<UploadedFile> {
    const response = await api.get(`/uploads/${id}`);
    return response.data;
  }

  async deleteFile(id: string): Promise<void> {
    await api.delete(`/uploads/${id}`);
  }
}

export default new UploadService();