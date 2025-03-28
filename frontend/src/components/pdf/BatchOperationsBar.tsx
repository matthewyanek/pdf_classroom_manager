\// src/components/pdf/BatchOperationsBar.tsx
import React from 'react';

interface BatchOperationsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onMoveToFolder: () => void;
}

const BatchOperationsBar: React.FC<BatchOperationsBarProps> = ({
  selectedCount,
  onDelete,
  onMoveToFolder
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md mb-4">
      <div className="text-sm text-gray-700">
        {selectedCount} PDF{selectedCount !== 1 ? 's' : ''} selected
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onMoveToFolder}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Move to Folder
        </button>
        {/* Remove the "Move to Unfiled" button */}
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