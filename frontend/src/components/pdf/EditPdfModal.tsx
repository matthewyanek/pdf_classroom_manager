import { useState, useEffect } from 'react';
import { pdfService } from '../../services/pdfService';

interface EditPdfModalProps {
  pdf: {
    id: number;
    filename: string;
    tags: string[];
  };
  onClose: () => void;
  onSave: () => void;
}

const EditPdfModal = ({ pdf, onClose, onSave }: EditPdfModalProps) => {
  const [filename, setFilename] = useState(pdf.filename);
  const [originalFilename, setOriginalFilename] = useState(pdf.filename);
  const [tags, setTags] = useState<string[]>([...pdf.tags]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Update state when pdf prop changes
    setFilename(pdf.filename);
    setOriginalFilename(pdf.filename);
    setTags([...pdf.tags]);
  }, [pdf]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Update tags
      await pdfService.updateTags(pdf.id, tags);
      
      // If filename changed, rename the PDF
      if (filename !== originalFilename) {
        await pdfService.renamePDF(pdf.id, filename);
      }
      
      onSave();
      onClose();
    } catch (err) {
      console.error('Error updating PDF:', err);
      setError('Failed to update PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Edit PDF</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="filename" className="block text-sm font-medium text-gray-300 mb-1">
            Filename
          </label>
          <input
            type="text"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <div key={tag} className="bg-blue-900 text-blue-100 px-2 py-1 rounded-full text-sm flex items-center">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-300 hover:text-blue-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              className="flex-1 p-2 bg-gray-700 border border-gray-600 text-white rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button
              onClick={handleAddTag}
              className="bg-blue-600 text-white px-3 rounded-r-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
          >
            Cancel
            </button>
            <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading ? 'bg-blue-700 opacity-70 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPdfModal;