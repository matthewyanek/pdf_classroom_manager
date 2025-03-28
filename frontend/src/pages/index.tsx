// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { usePDFs, useFolders, useTags } from '../hooks';
import { pdfService } from '../services/pdfService';

export default function Home() {
  // Use custom hooks
  const {
    folders,
    unfiledCount,
    loading: folderLoading,
    selectedFolderId,
    selectedFolderName,
    selectFolder,
    refreshFolders,
    createFolder,
    renameFolder,
    deleteFolder,
    updateFolderColor
  } = useFolders();

  const {
    tags,
    loading: tagLoading,
    selectedTag,
    selectTag,
    refreshTags
  } = useTags();

  // Fix: Call usePDFs with just the first argument
  const {
    pdfs,
    loading: pdfLoading,
    error: pdfError,
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
  } = usePDFs(undefined); // Start with no folder selected

  // State for sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // Refresh function that updates all data
  const handleRefresh = () => {
    refreshPDFs();
    refreshFolders();
    refreshTags();
  };

  // Update PDFs when folder changes
  useEffect(() => {
    console.log(`Selected folder changed to: ${selectedFolderId} (${selectedFolderName})`);
    updateFolderId(selectedFolderId);
  }, [selectedFolderId, updateFolderId, selectedFolderName]);
  
  // Update PDFs when tag changes
  useEffect(() => {
    console.log(`Selected tag changed to: ${selectedTag}`);
    updateTag(selectedTag);
  }, [selectedTag, updateTag]);

  // Handle folder selection
  const handleFolderSelect = (folderId: number | undefined | null, folderName: string) => {
    console.log(`Selecting folder: ${folderName} (ID: ${folderId})`);
    selectFolder(folderId, folderName);
    // No need to call updateFolderId here as the useEffect will handle it
  };

  // Handle tag selection
  const handleTagSelect = (tag: string | null) => {
    console.log(`Selecting tag: ${tag}`);
    selectTag(tag);
    // No need to call updateTag here as the useEffect will handle it
  };

  // Handle moving PDFs to a folder
  const handleMoveToFolder = (folderId: number | null) => {
    moveSelectedPDFsToFolder(folderId);
  };

  // Handle deleting selected PDFs
  const handleDeleteSelected = () => {
    if (confirm('Are you sure you want to delete the selected PDFs?')) {
      deleteSelectedPDFs();
    }
  };

  // Handle viewing a PDF
  const handleViewPDF = (pdfId: number, filename: string) => {
    viewPDF(pdfId, filename);
  };

  // Handle downloading a PDF
  const handleDownloadPDF = (pdfId: number, filename: string) => {
    downloadPDF(pdfId, filename);
  };

  // Handle deleting a single PDF
  const handleDeletePDF = async (pdfId: number) => {
    try {
      if (confirm('Are you sure you want to delete this PDF?')) {
        await pdfService.deletePDF(pdfId);
        refreshPDFs();
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);
    }
  };

  // Handle updating tags
  const handleUpdateTags = async (pdfId: number, tags: string[]) => {
    try {
      await pdfService.updateTags(pdfId, tags);
      refreshPDFs();
      refreshTags(); // Refresh tags to update tag counts
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  // Handle updating folder color
  const handleUpdateFolderColor = async (folderId: number, color: string) => {
    try {
      console.log(`Updating folder ${folderId} color to ${color}`);
      await updateFolderColor(folderId, color);
      refreshFolders();
    } catch (error) {
      console.error('Error updating folder color:', error);
    }
  };

  // Handle uploading PDFs
  const handleUploadPDF = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    fileInput.multiple = false;
    
    // Handle file selection
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      
      const file = target.files[0];
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Add folder ID if a folder is selected (not undefined and not for "All PDFs")
      if (selectedFolderId !== undefined && selectedFolderId !== null) {
        formData.append('folder_id', selectedFolderId.toString());
      }
      
      try {
        console.log('Uploading PDF:', file.name, 'to folder ID:', selectedFolderId);
        
        // Show loading indicator or toast notification
        const response = await fetch('/api/pdfs/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Upload failed (${response.status}): ${
              errorData.detail || response.statusText || 'Unknown error'
            }`
          );
        }
        
        const result = await response.json();
        console.log('Upload successful:', result);
        
        // Refresh data
        refreshPDFs();
        refreshFolders();
        refreshTags();
        
        // Show success message
        alert('PDF uploaded successfully!');
      } catch (error) {
        console.error('Error uploading PDF:', error);
        alert(`Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    // Trigger file selection dialog
    fileInput.click();
  };

  return (
    <Layout
      sidebarCollapsed={sidebarCollapsed}
      toggleSidebar={toggleSidebar}
      selectedFolderId={selectedFolderId}
      selectedTag={selectedTag}
      handleFolderSelect={handleFolderSelect}
      handleTagSelect={handleTagSelect}
      refreshTrigger={0}
      setRefreshTrigger={() => handleRefresh()}
      folders={folders}
      unfiledCount={unfiledCount}
      tags={tags}
      selectedFolderName={selectedFolderName}
      loading={pdfLoading}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      pdfs={pdfs}
      selectedPDFs={selectedPDFs}
      onPDFSelection={handlePDFSelection}
      onMoveToFolder={handleMoveToFolder}
      onDeleteSelected={handleDeleteSelected}
      onViewPDF={handleViewPDF}
      onDownloadPDF={handleDownloadPDF}
      onDeletePDF={handleDeletePDF}
      onUpdateTags={handleUpdateTags}
      apiError={pdfError}
      createFolder={createFolder}
      renameFolder={renameFolder}
      deleteFolder={deleteFolder}
      updateFolderColor={handleUpdateFolderColor}
      onUploadPDF={handleUploadPDF}
      viewingPDF={viewingPDF}
      onCloseViewer={closeViewer}
    />
  );
}