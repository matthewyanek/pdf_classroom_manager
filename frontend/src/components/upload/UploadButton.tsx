// src/components/upload/UploadButton.tsx
import React, { useState, useRef } from 'react';
import { pdfService } from '../../services/pdfService';

type UploadButtonProps = {
  currentFolderId: number | null | undefined;
  onUploadComplete: () => void;
  folders: { id: number; name: string }[];
};

const UploadButton: React.FC<UploadButtonProps> = ({
  currentFolderId,
  onUploadComplete,
  folders
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<number | null>(currentFolderId !== undefined ? currentFolderId : null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setShowModal(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('No file selected');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      await pdfService.uploadPDF(selectedFile, tags, selectedFolder);
      
      // Reset form
      setSelectedFile(null);
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Close modal and notify parent
      setShowModal(false);
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Upload PDF
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />
      
      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-full max-w-md bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Upload PDF</h3>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Selected File
                </label>
                <div className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md">
                  {selectedFile?.name}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="folder" className="block text-sm font-medium text-gray-400 mb-2">
                  Folder
                </label>
                <select
                  id="folder"
                  value={selectedFolder?.toString() || ''}
                  onChange={(e) => setSelectedFolder(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="">Unfiled</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-400 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-900 bg-opacity-50 text-red-200 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                  setError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadButton;