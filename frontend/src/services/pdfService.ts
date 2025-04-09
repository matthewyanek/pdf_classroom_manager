// src/services/pdfService.ts
import axios from 'axios';

export const pdfService = {
  async getPDFs(params: any = {}) {
    console.log('Getting PDFs with params:', params);
    
    try {
      const response = await axios.get('/api/pdfs', { params });
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      throw error;
    }
  },
  
  async uploadPDF(file: File, tags: string, folderId: number | null = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tags', tags);
      
      if (folderId !== null) {
        formData.append('folder_id', folderId.toString());
      }
      
      const response = await axios.post('/api/pdfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  },
  
  viewPDF(pdfId: number, filename: string) {
    try {
      // Open PDF in new tab
      window.open(`/uploads/${pdfId}/${filename}`, '_blank');
      return true;
    } catch (error) {
      console.error('Error viewing PDF:', error);
      throw error;
    }
  },
  
  downloadPDF(pdfId: number, filename: string) {
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = `/uploads/${pdfId}/${filename}`;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  },
  
  async deletePDFs(pdfIds: number[]) {
    try {
      const response = await axios.delete('/api/pdfs', {
        data: { pdf_ids: pdfIds }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting PDFs:', error);
      throw error;
    }
  },
  
  async deletePDF(pdfId: number) {
    try {
      const response = await axios.delete(`/api/pdfs/${pdfId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }
  },
  
  async movePDFsToFolder(pdfIds: number[], folderId: number | null) {
    console.log('Moving PDFs to folder:', { pdfIds, folderId });
    try {
      const response = await axios.post('/api/pdfs/move', {
        pdf_ids: pdfIds,
        folder_id: folderId
      });
      return response.data;
    } catch (error) {
      console.error('Error moving PDFs:', error);
      throw error;
    }
  },
  
  async updateTags(pdfId: number, tags: string[]) {
    try {
      const response = await axios.put(`/api/pdfs/${pdfId}/tags`, { tags });
      return response.data;
    } catch (error) {
      console.error('Error updating tags:', error);
      throw error;
    }
  },

  // New function for renaming PDFs
  async renamePDF(pdfId: number, newFilename: string) {
    try {
      // Ensure filename has .pdf extension
      if (!newFilename.toLowerCase().endsWith('.pdf')) {
        newFilename += '.pdf';
      }
      
      const response = await axios.put(`/api/pdfs/${pdfId}/rename`, {
        filename: newFilename
      });
      
      return response.data;
    } catch (error) {
      console.error('Error renaming PDF:', error);
      throw error;
    }
  }
};