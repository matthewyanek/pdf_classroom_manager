  // src/hooks/usePDFs.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PDF } from '../types/pdf';

interface ViewingPDF {
  id: number;
  filename: string;
}

export function usePDFs(initialFolderId?: number | null, initialTag?: string | null) {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folderId, setFolderId] = useState<number | null | undefined>(initialFolderId);
  const [tag, setTag] = useState<string | null>(initialTag || null);
  const [selectedPDFs, setSelectedPDFs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [viewingPDF, setViewingPDF] = useState<ViewingPDF | null>(null);

  // Helper function to process PDFs
  const processPDFs = (pdfsArray: any[]): PDF[] => {
    return pdfsArray.map(pdf => ({
      id: pdf.id,
      filename: pdf.filename || 'Unnamed PDF',
      folder_id: pdf.folder_id,
      folder_name: pdf.folder_name || '',
      tags: Array.isArray(pdf.tags) ? pdf.tags : 
            (typeof pdf.tags === 'string' ? pdf.tags.split(',').filter(Boolean) : []),
      date_added: pdf.date_added || pdf.created_at || '',
      size: pdf.size || 0
    }));
  };

  // Fetch PDFs from the API
  const fetchPDFs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the main PDFs endpoint with query parameters
      let url = '/api/pdfs';
      const params: Record<string, any> = {};
      
      console.log('Fetching PDFs with folder ID:', folderId);
      
      // Handle different cases based on folder ID
      if (folderId !== undefined) {
        if (folderId === -1) {
          // For unfiled PDFs, we want to filter for null folder_id
          // We'll use a special parameter to indicate unfiled
          params.unfiled = 'true';
        } else if (folderId !== null) {
          // For PDFs in a specific folder
          params.folder_id = folderId.toString();
        }
        // For folderId === null (All PDFs), don't add any folder parameter
      }

      // Add tag filter if a tag is selected
      if (tag) {
        params.tag = tag;
      }

      // Add search query if provided
      if (searchQuery) {
        params.search = searchQuery;
      }

      console.log('Fetching PDFs with:', { url, params, folderId, tag, searchQuery });
      
      const response = await axios.get(url, { params });
      console.log('PDFs response:', response.data);
      
      // Handle the response data - assuming it's an array
      let pdfsArray: any[] = [];
      
      if (Array.isArray(response.data)) {
        pdfsArray = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If the response is an object, try to find an array property
        const possibleArrayProps = ['pdfs', 'items', 'results', 'data'];
        
        for (const prop of possibleArrayProps) {
          if (Array.isArray(response.data[prop])) {
            pdfsArray = response.data[prop];
            break;
          }
        }
      }
      
      // For unfiled PDFs, filter client-side if needed
      if (folderId === -1) {
        pdfsArray = pdfsArray.filter(pdf => 
          pdf.folder_id === null || 
          pdf.folder_id === undefined || 
          pdf.folder_id === 0 ||
          pdf.folder_id === '' ||
          pdf.folder_id === -1
        );
        console.log('Filtered unfiled PDFs:', pdfsArray);
      }
      
      // Process the PDFs
      const processedPDFs = processPDFs(pdfsArray);
      
      console.log('Processed PDFs:', processedPDFs);
      setPdfs(processedPDFs);
    } catch (err: any) {
      console.error('Error fetching PDFs:', err);
      
      // Detailed error logging
      if (err.response) {
        console.log('Error response:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      }
      
      setPdfs([]);
      setError(`Failed to load PDFs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [folderId, tag, searchQuery]);

  // Fetch PDFs when dependencies change
  useEffect(() => {
    fetchPDFs();
  }, [fetchPDFs, refreshTrigger]);

  // Update folder ID
  const updateFolderId = useCallback((newFolderId: number | null | undefined) => {
    console.log(`Updating folder ID to: ${newFolderId}`);
    setFolderId(newFolderId);
    // Clear selection when changing folders
    setSelectedPDFs([]);
  }, []);

  // Update tag filter
  const updateTag = useCallback((newTag: string | null) => {
    console.log(`Updating tag filter to: ${newTag}`);
    setTag(newTag);
    // Clear selection when changing tags
    setSelectedPDFs([]);
  }, []);

  // Refresh PDFs
  const refreshPDFs = useCallback(() => {
    console.log('Triggering PDF refresh');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Handle PDF selection
  const handlePDFSelection = useCallback((pdfId: number, isSelected: boolean) => {
    setSelectedPDFs(prev => {
      // Special case: -1 means "clear all"
      if (pdfId === -1 && !isSelected) {
        return [];
      }
      
      if (isSelected) {
        // Add to selection if not already selected
        return prev.includes(pdfId) ? prev : [...prev, pdfId];
      } else {
        // Remove from selection
        return prev.filter(id => id !== pdfId);
      }
    });
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedPDFs([]);
  }, []);

  // Delete selected PDFs
  const deleteSelectedPDFs = useCallback(async () => {
    try {
      setLoading(true);
      
      // Make deletion requests for all selected PDFs
      await Promise.all(
        selectedPDFs.map(pdfId => 
          axios.delete(`/api/pdfs/${pdfId}`)
        )
      );
      
      // Clear selection and refresh
      setSelectedPDFs([]);
      refreshPDFs();
    } catch (err: any) {
      console.error('Error deleting PDFs:', err);
      setError(`Failed to delete PDFs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedPDFs, refreshPDFs]);

  // Move selected PDFs to a folder
  const moveSelectedPDFsToFolder = useCallback(async (targetFolderId: number | null) => {
    try {
      setLoading(true);
      
      // Create the request payload
      const payload = {
        pdf_ids: selectedPDFs,
        folder_id: targetFolderId
      };
      
      // Send the move request
      await axios.post('/api/pdfs/move', payload);
      
      // Clear selection and refresh
      setSelectedPDFs([]);
      refreshPDFs();
    } catch (err: any) {
      console.error('Error moving PDFs:', err);
      setError(`Failed to move PDFs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedPDFs, refreshPDFs]);

  // View a PDF in the in-app viewer
  const viewPDF = useCallback((pdfId: number, filename: string) => {
    // Set the viewing PDF to open the in-app viewer
    setViewingPDF({ id: pdfId, filename });
  }, []);

  // Close the PDF viewer
  const closeViewer = useCallback(() => {
    setViewingPDF(null);
  }, []);

  // Download a PDF
  const downloadPDF = useCallback((pdfId: number, filename: string) => {
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = `/api/pdfs/${pdfId}/download`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    pdfs,
    loading,
    error,
    selectedPDFs,
    searchQuery,
    setSearchQuery,
    handlePDFSelection,
    clearSelection,
    deleteSelectedPDFs,
    moveSelectedPDFsToFolder,
    refreshPDFs,
    updateFolderId,
    updateTag,
    viewPDF,
    downloadPDF,
    viewingPDF,
    closeViewer
  };
}