// frontend/src/pages/index.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from '../components/layout/Sidebar';
import PDFViewer from '../components/pdf/PDFViewer';
import PDFActions from '../components/pdf/PDFActions';
import { PDF, Folder, Tag } from '../types/pdf';
import { pdfService } from '../services/pdfService';

export default function Home() {
  // State
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<PDF | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [unfiledCount, setUnfiledCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPDFs, setSelectedPDFs] = useState<number[]>([]);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  // Load data from backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch PDFs
        const pdfResponse = await fetch('/api/pdfs');
        if (pdfResponse.ok) {
          const pdfData = await pdfResponse.json();
          console.log('PDFs from API:', pdfData);
          setPdfs(pdfData);
          
          // Count unfiled PDFs
          const unfiled = pdfData.filter((pdf: PDF) => pdf.folder_id === null).length;
          setUnfiledCount(unfiled);
        } else {
          console.error('Failed to fetch PDFs:', pdfResponse.statusText);
        }

        // Fetch folders
        const folderResponse = await fetch('/api/folders');
        if (folderResponse.ok) {
          const folderData = await folderResponse.json();
          console.log('Folders from API:', folderData);
          
          // Extract folders from the response (FastAPI returns a nested structure)
          if (folderData.folders) {
            setFolders(folderData.folders);
          } else {
            setFolders([]);
          }
          
          // Set unfiled count if available in the response
          if (folderData.unfiled_count !== undefined) {
            setUnfiledCount(folderData.unfiled_count);
          }
        } else {
          console.error('Failed to fetch folders:', folderResponse.statusText);
        }

        // Fetch tags
        const tagResponse = await fetch('/api/tags');
        if (tagResponse.ok) {
          const tagData = await tagResponse.json();
          console.log('Tags from API:', tagData);
          setTags(tagData);
        } else {
          console.error('Failed to fetch tags:', tagResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  // Create folder
  const createFolder = async (name: string) => {
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const newFolder = await response.json();
        triggerRefresh();
        return newFolder;
      } else {
        console.error('Failed to create folder:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      return null;
    }
  };

  // Rename folder
  const renameFolder = async (folderId: number, newName: string) => {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        triggerRefresh();
        return true;
      } else {
        console.error('Failed to rename folder:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error renaming folder:', error);
      return false;
    }
  };

  // Delete folder
  const deleteFolder = async (folderId: number) => {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (selectedFolderId === folderId) {
          setSelectedFolderId(null);
        }
        triggerRefresh();
        return true;
      } else {
        console.error('Failed to delete folder:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      return false;
    }
  };

  // Delete PDF
  const deletePdf = async (pdfId: number) => {
    try {
      const response = await fetch(`/api/pdfs/${pdfId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setPdfs(prevPdfs => prevPdfs.filter(pdf => pdf.id !== pdfId));
        // If this PDF was in the selected PDFs list, remove it
        if (selectedPDFs.includes(pdfId)) {
          setSelectedPDFs(prevSelected => prevSelected.filter(id => id !== pdfId));
        }
        triggerRefresh();
        return true;
      } else {
        console.error('Failed to delete PDF:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);
      return false;
    }
  };

  // Move PDFs to folder
  const movePDFsToFolder = async (pdfIds: number[], folderId: number | null) => {
    try {
      console.log('Moving PDFs to folder:', { pdfIds, folderId });
      await pdfService.movePDFsToFolder(pdfIds, folderId);
      triggerRefresh();
      return true;
    } catch (error) {
      console.error('Error moving PDFs:', error);
      return false;
    }
  };

  // Handle PDF selection
  const handlePDFSelection = (pdfId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPDFs(prev => [...prev, pdfId]);
    } else {
      setSelectedPDFs(prev => prev.filter(id => id !== pdfId));
    }
  };

  // Handle move to folder
  const handleMoveToFolder = (folderId: number | null) => {
    if (selectedPDFs.length === 0) return;
    
    movePDFsToFolder(selectedPDFs, folderId);
    setSelectedPDFs([]);
  };

  // Handle folder selection
  const handleFolderSelect = (folderId: number | undefined | null, folderName: string) => {
    // Convert undefined to -1 for unfiled
    const normalizedId = folderId === undefined ? -1 : folderId;
    setSelectedFolderId(normalizedId);
    setSelectedTag(null);
  };

  // Handle tag selection
  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setSelectedFolderId(null);
  };

  // Trigger refresh
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('file', files[0]);
    
    if (selectedFolderId !== null && selectedFolderId > 0) {
      formData.append('folder_id', selectedFolderId.toString());
    }

    try {
      const response = await fetch('/api/pdfs/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        triggerRefresh();
      } else {
        console.error('Upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Handle tags generated from AI
  const handleTagsGenerated = async (pdfId: number, tags: string[]) => {
    try {
      const response = await fetch(`/api/pdfs/${pdfId}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
      });

      if (response.ok) {
        // Update the PDF in the local state
        setPdfs(prevPdfs => 
          prevPdfs.map(pdf => 
            pdf.id === pdfId ? { ...pdf, tags } : pdf
          )
        );
        
        // Refresh to update tag counts
        triggerRefresh();
      } else {
        console.error('Failed to update tags:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined || bytes === null) return 'Unknown size';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Filter PDFs based on selected folder, tag, and search query
  const filteredPdfs = pdfs.filter(pdf => {
    // Filter by folder
    const matchesFolder = selectedFolderId === null
      ? true // Show all if no folder selected
      : selectedFolderId === -1
        ? pdf.folder_id === null // Show unfiled
        : pdf.folder_id === selectedFolderId; // Show specific folder
    
    // Filter by tag
    const matchesTag = selectedTag === null
      ? true // Show all if no tag selected
      : pdf.tags && pdf.tags.includes(selectedTag);
    
    // Filter by search query
    const matchesSearch = !searchQuery
      ? true // Show all if no search query
      : pdf.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pdf.tags && pdf.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    
    return matchesFolder && matchesTag && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Head>
        <title>PDF Classroom Manager</title>
        <meta name="description" content="Manage your classroom PDFs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        selectedFolderId={selectedFolderId === -1 ? undefined : selectedFolderId}
        selectedTag={selectedTag}
        handleFolderSelect={handleFolderSelect}
        handleTagSelect={handleTagSelect}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={triggerRefresh}
        folders={folders || []} // Ensure we always pass an array
        unfiledCount={unfiledCount}
        tags={tags || []} // Ensure we always pass an array
        createFolder={createFolder}
        renameFolder={renameFolder}
        deleteFolder={deleteFolder}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 p-4 flex justify-between items-center">
          <div className="flex items-center">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-bold">PDF Classroom Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 pl-8 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg 
                className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4">
          {/* Actions */}
          <div className="flex mb-4 space-x-2">
            <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer flex items-center">
              {/* Upload Icon */}
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Documents */}
          <div>
            <h2 className="text-lg font-medium mb-2">
              {selectedTag !== null
                ? `Tag: ${selectedTag}`
                : selectedFolderId === null
                  ? 'All PDFs'
                  : selectedFolderId === -1
                    ? 'Unfiled PDFs'
                    : `Folder: ${folders.find(f => f.id === selectedFolderId)?.name || 'Unknown'}`}
            </h2>
            
            {/* Batch operations bar */}
            {selectedPDFs.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md mb-4">
                <div className="text-sm text-gray-300">
                  {selectedPDFs.length} PDF{selectedPDFs.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      Move to Folder
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showFolderDropdown && (
                      <div className="absolute right-0 mt-1 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleMoveToFolder(null);
                              setShowFolderDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                          >
                            Unfiled
                          </button>
                          
                          {folders.map(folder => (
                            <button
                              key={folder.id}
                              onClick={() => {
                                handleMoveToFolder(folder.id);
                                setShowFolderDropdown(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                            >
                              {folder.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${selectedPDFs.length} PDFs?`)) {
                        selectedPDFs.forEach(id => deletePdf(id));
                        setSelectedPDFs([]);
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredPdfs.length === 0 ? (
              <p className="text-gray-400">No documents found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPdfs.map((pdf) => (
                  <div
                    key={pdf.id}
                    className={`group p-4 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors relative ${
                      selectedPDFs.includes(pdf.id) ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      {/* Checkbox for selection */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePDFSelection(pdf.id, !selectedPDFs.includes(pdf.id));
                        }}
                        className={`w-5 h-5 rounded border ${
                          selectedPDFs.includes(pdf.id) 
                            ? 'bg-blue-500 border-blue-600' 
                            : 'border-gray-500 bg-gray-700'
                        } mr-2 flex items-center justify-center cursor-pointer`}
                      >
                        {selectedPDFs.includes(pdf.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>

                      {/* File Icon */}
                      <svg 
                        className="w-5 h-5 text-blue-400 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => setSelectedPdf(pdf)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      
                      {/* Filename */}
                      <span 
                        className="truncate cursor-pointer" 
                        onClick={() => setSelectedPdf(pdf)}
                      >
                        {pdf.filename}
                      </span>
                    </div>
                    
                    {/* Display tags if available */}
                    <div 
                      className="flex flex-wrap gap-1 mt-2 mb-6" // Added margin-bottom to make room for action buttons
                      onClick={() => setSelectedPdf(pdf)}
                    >
                      {pdf.tags && pdf.tags.length > 0 ? (
                        pdf.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="bg-blue-900 text-blue-100 text-xs px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">No tags</span>
                      )}
                    </div>
                    
                    <div 
                      className="text-xs text-gray-400 mt-2"
                      onClick={() => setSelectedPdf(pdf)}
                    >
                      {formatFileSize(pdf.size)}
                    </div>
                    
                    {/* PDF Actions - positioned in bottom right corner */}
                    <PDFActions
                      pdf={pdf}
                      onView={(id, filename) => setSelectedPdf(pdf)}
                      onDownload={(id, filename) => pdfService.downloadPDF(id, filename)}
                      onDelete={(id) => {
                        if (confirm(`Are you sure you want to delete "${pdf.filename}"?`)) {
                          deletePdf(id);
                        }
                      }}
                      onRefresh={triggerRefresh}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* PDF Viewer */}
      {selectedPdf && (
        <PDFViewer
          pdfUrl={`/api/pdfs/${selectedPdf.id}/view`}
          filename={selectedPdf.filename}
          onClose={() => setSelectedPdf(null)}
          onTagsGenerated={(tags) => handleTagsGenerated(selectedPdf.id, tags)}
        />
      )}
    </div>
  );
}