// src/components/folder/FolderList.tsx
import React, { useState } from 'react';
import { Folder } from '../../types/pdf';
import NewFolderModal from './NewFolderModal';

interface FolderListProps {
  selectedFolderId: number | undefined | null;
  onSelectFolder: (folderId: number | undefined | null, folderName: string) => void;
  onRefresh: () => void;
  refreshTrigger: number;
  folders: Folder[];
  unfiledCount: number;
  onRenameFolder?: (folderId: number, newName: string) => Promise<any>;
  onDeleteFolder?: (folderId: number) => Promise<any>;
}

const FolderList: React.FC<FolderListProps> = ({ 
  selectedFolderId, 
  onSelectFolder,
  onRefresh,
  refreshTrigger,
  folders = [],
  unfiledCount,
  onRenameFolder,
  onDeleteFolder
}) => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  // Handle folder rename click
  const handleRenameClick = (e: React.MouseEvent, folder: Folder) => {
    e.stopPropagation();
    setEditingFolderId(folder.id);
    setNewFolderName(folder.name);
  };

  // Handle folder delete click
  const handleDeleteClick = (e: React.MouseEvent, folder: Folder) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the folder "${folder.name}"?`)) {
      onDeleteFolder?.(folder.id).then(() => {
        onRefresh();
      }).catch(err => {
        console.error('Error deleting folder:', err);
        alert('Failed to delete folder');
      });
    }
  };

  // Handle rename form submission
  const handleRenameSubmit = (e: React.FormEvent, folderId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (newFolderName.trim() && onRenameFolder) {
      onRenameFolder(folderId, newFolderName.trim())
        .then(() => {
          setEditingFolderId(null);
          setNewFolderName('');
          onRefresh();
        })
        .catch(err => {
          console.error('Error renaming folder:', err);
          alert('Failed to rename folder');
        });
    }
  };

  return (
    <div>
      <ul className="space-y-1 mb-4">
        <li>
          <button
            onClick={() => onSelectFolder(null, 'All PDFs')}
            className={`w-full text-left px-3 py-2 rounded-md ${
              selectedFolderId === null
                ? 'bg-blue-700 text-white'
                : 'hover:bg-gray-700'
            }`}
          >
            All PDFs
          </button>
        </li>
        <li>
          <button
            onClick={() => onSelectFolder(-1, 'Unfiled')}
            className={`w-full text-left px-3 py-2 rounded-md flex justify-between ${
              selectedFolderId === -1
                ? 'bg-blue-700 text-white'
                : 'hover:bg-gray-700'
            }`}
          >
            <span>Unfiled</span>
            <span className="text-gray-400">{unfiledCount}</span>
          </button>
        </li>
        {folders.map(folder => (
          <li key={folder.id}>
            {editingFolderId === folder.id ? (
              <form 
                onSubmit={(e) => handleRenameSubmit(e, folder.id)}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-2 rounded-md bg-gray-800"
              >
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                  className="w-full bg-gray-700 text-white rounded-md px-2 py-1 mb-1"
                />
                <div className="flex justify-end space-x-2 mt-1">
                  <button 
                    type="submit" 
                    className="px-2 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFolderId(null);
                    }} 
                    className="px-2 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div
                className={`group w-full text-left px-3 py-2 rounded-md ${
                  selectedFolderId === folder.id
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onSelectFolder(folder.id, folder.name)}
                    className="flex-1 text-left flex items-center"
                  >
                    <span className="truncate mr-2">{folder.name}</span>
                  </button>
                  
                  <div className="flex items-center">
                    {/* Folder actions - only visible on hover */}
                    <div className="hidden group-hover:flex mr-2 space-x-1">
                      {/* Rename button */}
                      {onRenameFolder && (
                        <button
                          onClick={(e) => handleRenameClick(e, folder)}
                          className="p-1 text-gray-400 hover:text-white"
                          title="Rename folder"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Delete button */}
                      {onDeleteFolder && (
                        <button
                          onClick={(e) => handleDeleteClick(e, folder)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title="Delete folder"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Count always visible, not covered by icons */}
                    <span className="text-gray-400 min-w-[25px] text-right">{folder.pdf_count}</span>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => setIsCreatingFolder(true)}
        className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Folder
      </button>

      {isCreatingFolder && (
        <NewFolderModal
          onClose={() => setIsCreatingFolder(false)}
          onFolderCreated={() => {
            setIsCreatingFolder(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default FolderList;