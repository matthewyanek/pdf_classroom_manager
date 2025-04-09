// src/components/pdf/BatchOperationsBar.tsx
import React, { useState } from 'react';
import { pdfService } from '../../services/pdfService';

interface FolderOption {
  id: number;
  name: string;
}

interface BatchOperationsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onMoveToFolder: (folderId: number | null) => void;
  folders: FolderOption[];
}

const BatchOperationsBar: React.FC<BatchOperationsBarProps> = ({
  selectedCount,
  onDelete,
  onMoveToFolder,
  folders = []
}) => {
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md mb-4">
      <div className="text-sm text-gray-700">
        {selectedCount} PDF{selectedCount !== 1 ? 's' : ''} selected
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
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onMoveToFolder(null); // Pass null for Unfiled
                    setShowFolderDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Unfiled
                </button>
                
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      onMoveToFolder(folder.id);
                      setShowFolderDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {folder.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default BatchOperationsBar;