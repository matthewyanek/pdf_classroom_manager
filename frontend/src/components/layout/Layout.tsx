// src/components/layout/Layout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import PDFList from '../pdf/PDFList';
import PDFViewer from '../pdf/PDFViewer';
import SimplePDFViewer from '../pdf/SimplePDFViewer';
import { Folder, PDF, Tag } from '../../types/pdf';

type LayoutProps = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  selectedFolderId: number | undefined | null;
  selectedTag: string | null;
  handleFolderSelect: (folderId: number | undefined | null, folderName: string) => void;
  handleTagSelect: (tag: string | null) => void;
  refreshTrigger: number;
  setRefreshTrigger: () => void;
  folders: Folder[];
  unfiledCount: number;
  tags: Tag[];
  selectedFolderName: string;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pdfs: PDF[];
  selectedPDFs: number[];
  onPDFSelection: (pdfId: number, isSelected: boolean) => void;
  onMoveToFolder: (folderId: number | null) => void;
  onDeleteSelected: () => void;
  onViewPDF: (pdfId: number, filename: string) => void;
  onDownloadPDF: (pdfId: number, filename: string) => void;
  onDeletePDF: (pdfId: number) => void;
  onUpdateTags: (pdfId: number, tags: string[]) => void;
  apiError: string | null;
  createFolder: (name: string) => Promise<any>;
  renameFolder?: (folderId: number, newName: string) => Promise<any>;
  deleteFolder?: (folderId: number) => Promise<any>;
  onUploadPDF?: () => void;
  viewingPDF: { id: number; filename: string } | null;
  onCloseViewer: () => void;
};

const Layout: React.FC<LayoutProps> = ({
  sidebarCollapsed,
  toggleSidebar,
  selectedFolderId,
  selectedTag,
  handleFolderSelect,
  handleTagSelect,
  refreshTrigger,
  setRefreshTrigger,
  folders,
  unfiledCount,
  tags,
  selectedFolderName,
  loading,
  searchQuery,
  setSearchQuery,
  pdfs,
  selectedPDFs,
  onPDFSelection,
  onMoveToFolder,
  onDeleteSelected,
  onViewPDF,
  onDownloadPDF,
  onDeletePDF,
  onUpdateTags,
  apiError,
  createFolder,
  renameFolder,
  deleteFolder,
  onUploadPDF,
  viewingPDF,
  onCloseViewer
}) => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        selectedFolderId={selectedFolderId}
        selectedTag={selectedTag}
        handleFolderSelect={handleFolderSelect}
        handleTagSelect={handleTagSelect}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
        folders={folders}
        unfiledCount={unfiledCount}
        tags={tags}
        createFolder={createFolder}
        renameFolder={renameFolder}
        deleteFolder={deleteFolder}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with search and actions */}
        <div className="bg-gray-800 p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search PDFs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              {/* Upload PDF Button */}
              {onUploadPDF && (
                <button
                  onClick={onUploadPDF}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                    />
                  </svg>
                  Upload PDF
                </button>
              )}

              {selectedPDFs.length > 0 && (
                <>
                  <div className="flex items-center mr-2 text-gray-300">
                    <span>{selectedPDFs.length} selected</span>
                  </div>
                  <button
                    onClick={() => onPDFSelection(-1, false)}
                    className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
                  >
                    Clear
                  </button>
                  <div className="relative group">
                    <button
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Move to
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10 hidden group-hover:block">
                      <div className="py-1">
                        <button
                          onClick={() => onMoveToFolder(null)}
                          className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
                        >
                          Unfiled
                        </button>
                        {folders.map((folder) => (
                          <button
                            key={folder.id}
                            onClick={() => onMoveToFolder(folder.id)}
                            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
                          >
                            {folder.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onDeleteSelected}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Folder name and count */}
        <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {selectedTag ? `Tag: ${selectedTag}` : selectedFolderName}
            </h2>
            <span className="text-gray-400">
              {pdfs.length} {pdfs.length === 1 ? 'PDF' : 'PDFs'}
            </span>
          </div>
        </div>

        {/* PDF list */}
        <div className="flex-1 overflow-auto bg-gray-900 p-4">
          {apiError && (
            <div className="bg-red-900 text-white p-3 rounded-md mb-4">
              Error: {apiError}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : pdfs.length > 0 ? (
            <PDFList
              pdfs={pdfs}
              selectedPDFs={selectedPDFs}
              onPDFSelection={onPDFSelection}
              onViewPDF={onViewPDF}
              onDownloadPDF={onDownloadPDF}
              onDeletePDF={onDeletePDF}
              onUpdateTags={onUpdateTags}
              allTags={tags.map(tag => tag.name)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              {/* PDF document icon without folder */}
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl">No PDFs found</p>
              <p className="mt-2">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Upload some PDFs to get started'}
              </p>
              
              {/* Add upload button in empty state too */}
              {onUploadPDF && (
                <button
                  onClick={onUploadPDF}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                    />
                  </svg>
                  Upload PDF
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {viewingPDF && (
        <PDFViewer
          pdfUrl={`/api/pdfs/${viewingPDF.id}/view`}
          filename={viewingPDF.filename}
          onClose={onCloseViewer}
        />
      )}
    </div>
  );
};

export default Layout;