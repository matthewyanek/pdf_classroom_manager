// components/PDFUploadSlim.tsx
import React, { useState, useRef } from 'react';
import axios from 'axios';

interface PDFUploadProps {
  onUploadComplete: () => void;
}

const PDFUploadSlim: React.FC<PDFUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);
    
    try {
      await axios.post('http://localhost:8000/api/pdfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Reset form and notify parent
      setFile(null);
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-md shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-200">Upload New Worksheet</h3>
        <span className="text-xs text-gray-400">PDF files only</span>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
              id="pdf-upload"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Choose File
            </button>
            <div className="ml-3 text-xs text-gray-400 truncate">
              {file ? file.name : 'No file chosen'}
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={handleTagsChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="mt-1 text-xs text-gray-400">Add tags to help organize and find your PDFs later</div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center ${
              !file || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFUploadSlim;