// src/components/tag/TagsEditor.tsx
import React, { useState } from 'react';

type TagsEditorProps = {
  pdfId: number;
  currentTags: string[];
  onSave: (pdfId: number, tags: string[]) => void;
  onClose: () => void;
  allTags: string[]; // For suggestions
};

const TagsEditor: React.FC<TagsEditorProps> = ({
  pdfId,
  currentTags,
  onSave,
  onClose,
  allTags
}) => {
  const [tags, setTags] = useState<string[]>(currentTags);
  const [newTag, setNewTag] = useState('');
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSave = () => {
    onSave(pdfId, tags);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-md bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Edit Tags</h3>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Current Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map(tag => (
                  <div key={tag} className="flex items-center bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-300 hover:text-blue-100 focus:outline-none"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No tags added yet</p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Add Tag
            </label>
            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 bg-gray-700 text-white rounded-l-md border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Enter tag name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          </div>
          
          {allTags.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Suggested Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags
                  .filter(tag => !tags.includes(tag))
                  .slice(0, 10)
                  .map(tag => (
                    <button
                      key={tag}
                      onClick={() => setTags([...tags, tag])}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Tags
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagsEditor;