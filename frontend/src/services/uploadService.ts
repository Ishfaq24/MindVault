import { axiosClient } from './axiosClient';
import { FileMeta } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const uploadService = {
  async getUploads(): Promise<FileMeta[]> {
    const response = await axiosClient.get<ApiResponse<FileMeta[]>>('/uploads');
    return response.data.data;
  },

  async uploadFile(
    file: File,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal
  ): Promise<FileMeta> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    formData.append('originalName', file.name);
    formData.append('size', file.size.toString());
    formData.append('mimeType', file.type || 'application/octet-stream');

    const response = await axiosClient.post<ApiResponse<FileMeta>>('/uploads', formData, {
      onUploadProgress: progressEvent => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        }
      },
      signal,
    });
    return response.data.data;
  },

  async getUploadById(id: string): Promise<FileMeta> {
    const response = await axiosClient.get<ApiResponse<FileMeta>>(`/uploads/${id}`);
    return response.data.data;
  },

  async downloadFile(id: string, filename: string): Promise<void> {
    const response = await axiosClient.get<ApiResponse<{ url: string }>>(`/uploads/${id}/download`);
    const url = response.data.data.url;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async updateUpload(id: string, updates: Partial<{ filename: string; originalName: string }>): Promise<FileMeta> {
    const response = await axiosClient.patch<ApiResponse<FileMeta>>(`/uploads/${id}`, updates);
    return response.data.data;
  },

  async deleteUpload(id: string): Promise<boolean> {
    await axiosClient.delete(`/uploads/${id}`);
    return true;
  },
};
