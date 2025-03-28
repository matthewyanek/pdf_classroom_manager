// src/services/folderService.ts
import api from './api';
import { Folder } from '../types/folder';

export const folderService = {
  // Get all folders
  async getFolders() {
    const response = await api.get('/folders/');
    return response.data.folders as Folder[];
  },

  // Create a new folder
  async createFolder(name: string) {
    const response = await api.post('/folders/', { name });
    return response.data as Folder;
  },

  // Delete a folder
  async deleteFolder(id: number) {
    const response = await api.delete(`/folders/${id}`);
    return response.data;
  },

  // Rename a folder
  async renameFolder(id: number, name: string) {
    const response = await api.put(`/folders/${id}`, { name });
    return response.data as Folder;
  },

  // Get unfiled count
  async getUnfiledCount() {
    const response = await api.get('/pdfs/unfiled-count');
    return response.data.count as number;
  }
};