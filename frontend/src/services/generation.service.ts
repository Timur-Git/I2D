import api from './api';

export interface GenerateRequest {
  photo_ids: string[];
  product_type?: string;
  additional_info?: string;
}

export interface GenerationResult {
  id: string;
  title: string;
  description: string;
  photo_ids: string[];
  created_at: string;
  modified_at: string | null;
}

interface HistoryResponse {
  items: GenerationResult[];
  total: number;
  page: number;
  pages: number;
}

class GenerationService {
  async generate(data: GenerateRequest): Promise<GenerationResult> {
    const response = await api.post('/generate', data);
    return response.data;
  }

  async saveToHistory(result: Omit<GenerationResult, 'modified_at'>): Promise<void> {
    await api.post('/history', result);
  }

  async getHistory(page: number = 1, limit: number = 10): Promise<HistoryResponse> {
    const response = await api.get('/history', {
      params: { page, limit }
    });
    return response.data;
  }

  async editHistoryItem(id: string, data: { title: string; description: string }): Promise<GenerationResult> {
    const response = await api.put(`/history/${id}/edit`, data);
    return response.data;
  }

  async deleteHistoryItem(id: string): Promise<void> {
    await api.delete(`/history/${id}`);
  }

  async clearHistory(): Promise<void> {
    await api.delete('/history/clear');
  }
}

export default new GenerationService();