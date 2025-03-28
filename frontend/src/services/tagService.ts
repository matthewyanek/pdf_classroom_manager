// src/services/tagService.ts
import api from './api';
import { Tag } from '../types/tag';

export const tagService = {
  // Get all tags
  async getTags() {
    const response = await api.get('/tags/');
    return response.data as Tag[];
  }
};