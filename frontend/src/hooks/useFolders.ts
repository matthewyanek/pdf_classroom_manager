// src/hooks/useFolders.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Folder } from '../types/pdf';

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [unfiledCount, setUnfiledCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined | null>(undefined);
  const [selectedFolderName, setSelectedFolderName] = useState<string>('All PDFs');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch folders
  const fetchFolders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching folders...');
      const response = await axios.get('/api/folders');
      console.log('Folders API response:', response.data);
      
      // Handle the nested structure {folders: Array, unfiled_count: number}
      let foldersArray: any[] = [];
      let unfiled = 0;
      
      if (response.data && typeof response.data === 'object') {
        // Check if response has a folders property that is an array
        if (response.data.folders && Array.isArray(response.data.folders)) {
          foldersArray = response.data.folders;
          console.log('Found folders array in response:', foldersArray);
        }
        
        // Check if response has an unfiled_count property
        if ('unfiled_count' in response.data && typeof response.data.unfiled_count === 'number') {
          unfiled = response.data.unfiled_count;
          console.log('Found unfiled count in response:', unfiled);
        }
      } else if (Array.isArray(response.data)) {
        // If the response is already an array, use it directly
        foldersArray = response.data;
      }
      
      // Process folders to ensure consistent format
      const processedFolders = foldersArray.map((folder: any) => ({
        id: folder.id,
        name: folder.name || 'Unnamed Folder',
        pdf_count: typeof folder.pdf_count === 'number' ? folder.pdf_count : 0,
        color: folder.color || undefined
      }));
      
      console.log('Processed folders:', processedFolders);
      setFolders(processedFolders);
      setUnfiledCount(unfiled);
      
      // Skip the separate unfiled count API call since we already have it
    } catch (err) {
      console.error('Error fetching folders:', err);
      setError('Failed to load folders');
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch folders when component mounts or refresh is triggered
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders, refreshTrigger]);

  // Select a folder
  const selectFolder = useCallback((folderId: number | undefined | null, folderName: string) => {
    console.log(`Selecting folder: ${folderName} (ID: ${folderId})`);
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Folders state:', {
      folders,
      unfiledCount,
      selectedFolderId,
      selectedFolderName,
      totalPDFs: folders.reduce((total, folder) => total + folder.pdf_count, 0) + unfiledCount
    });
  }, [folders, unfiledCount, selectedFolderId, selectedFolderName]);

  // Create a folder
  const createFolder = useCallback(async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating folder:', name);
      const response = await axios.post('/api/folders', { name });
      console.log('Create folder response:', response.data);
      
      // Refresh folders
      await fetchFolders();
      return response.data;
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('Failed to create folder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFolders]);

  // Delete a folder
  const deleteFolder = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.delete(`/api/folders/${id}`);
      console.log('Delete folder response:', response.data);
      
      // Reset selected folder if it was deleted
      if (selectedFolderId === id) {
        setSelectedFolderId(undefined);
        setSelectedFolderName('All PDFs');
      }
      
      // Refresh folders
      await fetchFolders();
      return response.data;
    } catch (err) {
      console.error('Error deleting folder:', err);
      setError('Failed to delete folder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFolders, selectedFolderId]);

  // Rename a folder
  const renameFolder = useCallback(async (id: number, newName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`/api/folders/${id}`, { name: newName });
      console.log('Rename folder response:', response.data);
      
      // Update selected folder name if it was renamed
      if (selectedFolderId === id) {
        setSelectedFolderName(newName);
      }
      
      // Refresh folders
      await fetchFolders();
      return response.data;
    } catch (err) {
      console.error('Error renaming folder:', err);
      setError('Failed to rename folder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFolders, selectedFolderId]);

  // Update folder color
  const updateFolderColor = useCallback(async (id: number, color: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Updating folder ${id} color to ${color}`);
      const response = await axios.put(`/api/folders/${id}`, { color });
      console.log('Update folder color response:', response.data);
      
      // Refresh folders
      await fetchFolders();
      return response.data;
    } catch (err) {
      console.error('Error updating folder color:', err);
      setError('Failed to update folder color');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFolders]);

  return {
    folders,
    unfiledCount,
    loading,
    error,
    selectedFolderId,
    selectedFolderName,
    selectFolder,
    createFolder,
    deleteFolder,
    renameFolder,
    updateFolderColor,
    refreshFolders: useCallback(() => setRefreshTrigger(prev => prev + 1), [])
  };
}