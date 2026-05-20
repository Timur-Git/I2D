import api from './api';

export interface GenerateRequest {
  upload_ids: string[];
  config?: {
    language?: 'en' | 'ru';
    tone?: 'formal' | 'casual';
    max_length?: number;
  };
}

export interface GenerationResult {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  modified_at: string | null;
  is_edited?: boolean;
  user_id?: string;
}

interface HistoryResponse {
  data: GenerationResult[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

class GenerationService {
  async generate(data: GenerateRequest): Promise<GenerationResult> {
    const response = await api.post('/generate', data);
    return response.data;
  }

  async saveToHistory(result: { 
    image_url: string;
    title: string; 
    description: string; 
  }): Promise<GenerationResult> {
    const response = await api.post('/history', result);
    return response.data;
  }

  async getHistory(
    page: number = 1, 
    limit: number = 20,
    search_query?: string,
    selected_date?: string,
    sort_by_date?: 'asc' | 'desc'
  ): Promise<HistoryResponse> {
    const params: any = { page, limit };
    if (search_query) params.search_query = search_query;
    if (selected_date) params.selected_date = selected_date;
    if (sort_by_date) params.sort_by_date = sort_by_date;
    
    const response = await api.get('/history', { params });
    return response.data;
  }

  async editHistoryItem(id: string, data: { title: string; description: string }): Promise<GenerationResult> {
    const response = await api.put(`/history/${id}/edit`, data);
    return response.data;
  }

  async deleteHistoryItem(id: string): Promise<void> {
    await api.delete(`/history/${id}`);
  }

  async clearHistory(): Promise<{ message: string }> {
    const response = await api.delete('/history/clear');
    return response.data;
  }
}

export default new GenerationService();