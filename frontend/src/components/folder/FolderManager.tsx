import { useState } from 'react';
import axios from 'axios';

interface FolderManagerProps {
  selectedPdfIds: number[];
  folders: { id: number; name: string }[];
  onFoldersUpdated: () => void;
  onClose: () => void;
}

const FolderManager = ({ selectedPdfIds, folders, onFoldersUpdated, onClose }: FolderManagerProps) => {
  const [isMoving, setIsMoving] = useState(false);
  
  const moveToFolder = async (folderId: number | null) => {
    if (selectedPdfIds.length === 0) return;
    
    setIsMoving(true);
    try {
      await axios.post('http://localhost:8000/api/pdfs/move', {
        pdf_ids: selectedPdfIds,
        folder_id: folderId
      });
      
      onFoldersUpdated();
      onClose();
    } catch (error) {
      console.error('Error moving PDFs:', error);
      alert('Failed to move PDFs to folder.');
    } finally {
      setIsMoving(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Move {selectedPdfIds.length} {selectedPdfIds.length === 1 ? 'PDF' : 'PDFs'} to:
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        <button
          onClick={() => moveToFolder(null)}
          disabled={isMoving}
          className="w-full text-left p-2 rounded hover:bg-gray-100 border border-gray-200"
        >
          Unfiled
        </button>
        
        {folders.map(folder => (
          <button
            key={folder.id}
            onClick={() => moveToFolder(folder.id)}
            disabled={isMoving}
            className="w-full text-left p-2 rounded hover:bg-gray-100 border border-gray-200"
          >
            {folder.name}
          </button>
        ))}
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 mr-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FolderManager;