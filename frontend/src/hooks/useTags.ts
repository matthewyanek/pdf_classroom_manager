// src/hooks/useTags.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Tag } from '../types/pdf';

// Create a simple tag service if you don't have one
const tagService = {
  async getTags() {
    return axios.get('/api/tags');
  },
  async getTag(name: string) {
    return axios.get(`/api/tags/${name}`);
  }
};

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch tags
  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tagService.getTags();
      
      if (Array.isArray(response.data)) {
        setTags(response.data);
      } else if (response.data && Array.isArray(response.data.tags)) {
        setTags(response.data.tags);
      } else {
        console.error('API did not return an array for tags!', response.data);
        setTags([]);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
      setTags([]);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tags when component mounts or refresh is triggered
  useEffect(() => {
    fetchTags();
  }, [fetchTags, refreshTrigger]);

  // Select a tag
  const selectTag = useCallback((tag: string | null) => {
    setSelectedTag(tag);
  }, []);

  return {
    tags,
    loading,
    error,
    selectedTag,
    selectTag,
    refreshTags: useCallback(() => setRefreshTrigger(prev => prev + 1), [])
  };
}