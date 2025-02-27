import { useState } from 'react';
import axios from 'axios';

interface BatchOperationsBarProps {
  selectedPdfIds: number[];
  clearSelection: () => void;
  refreshPdfs: () => void;
}

const BatchOperationsBar = ({ selectedPdfIds, clearSelection, refreshPdfs }: BatchOperationsBarProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [batchTagInput, setBatchTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [operation, setOperation] = useState<'add_tags' | 'remove_tags' | null>(null);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedPdfIds.length} selected PDF(s)?`)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.post('http://localhost:8000/api/pdfs/batch', {
        operation: 'delete',
        pdf_ids: selectedPdfIds
      });
      
      refreshPdfs();
      clearSelection();
    } catch (error) {
      console.error('Error deleting PDFs:', error);
      alert('Failed to delete PDFs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagOperation = (op: 'add_tags' | 'remove_tags') => {
    setOperation(op);
    setShowTagInput(true);
  };

  const submitTagOperation = async () => {
    if (!batchTagInput.trim() || !operation) return;
    
    const tags = batchTagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    if (tags.length === 0) return;
    
    setIsLoading(true);
    
    try {
      await axios.post('http://localhost:8000/api/pdfs/batch', {
        operation,
        pdf_ids: selectedPdfIds,
        tags
      });
      
      refreshPdfs();
      clearSelection();
      setShowTagInput(false);
      setBatchTagInput('');
      setOperation(null);
    } catch (error) {
      console.error('Error updating tags:', error);
      alert('Failed to update tags. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border-t border-b border-blue-100 p-3 mb-4 flex items-center justify-between">
      <div>
        <span className="font-medium">{selectedPdfIds.length} PDF{selectedPdfIds.length !== 1 ? 's' : ''} selected</span>
        <button 
          onClick={clearSelection}
          className="ml-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Clear selection
        </button>
      </div>
      
      {showTagInput ? (
        <div className="flex-1 mx-4 flex">
          <input
            type="text"
            value={batchTagInput}
            onChange={(e) => setBatchTagInput(e.target.value)}
            placeholder="Enter tags separated by commas..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md"
          />
          <button
            onClick={submitTagOperation}
            disabled={isLoading}
            className={`px-3 py-2 rounded-r-md text-white ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processing...' : operation === 'add_tags' ? 'Add Tags' : 'Remove Tags'}
          </button>
          <button
            onClick={() => {
              setShowTagInput(false);
              setBatchTagInput('');
              setOperation(null);
            }}
            className="ml-2 px-3 py-2 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-x-2">
          <button
            onClick={() => handleTagOperation('add_tags')}
            disabled={isLoading}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Tags
          </button>
          <button
            onClick={() => handleTagOperation('remove_tags')}
            disabled={isLoading}
            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Remove Tags
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchOperationsBar;