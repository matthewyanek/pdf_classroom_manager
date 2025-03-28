// src/components/debug/DebugPanel.tsx
import React, { useState } from 'react';
import { PDF, Folder, Tag } from '../../types';

type DebugPanelProps = {
  pdfs: PDF[];
  folders: Folder[];
  tags: Tag[];
};

const DebugPanel: React.FC<DebugPanelProps> = ({ pdfs, folders, tags }) => {
  const [isOpen, setIsOpen] = useState(false);

  const samplePdfs = pdfs.slice(0, 2).map(pdf => ({
    id: pdf.id,
    filename: pdf.filename,
    date_added: pdf.date_added,
    size: pdf.size,
    folder_id: pdf.folder_id,
    folder_name: pdf.folder_name,
    tags: pdf.tags
  }));

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-1 rounded-md shadow-lg"
      >
        {isOpen ? 'Close Debug' : 'Debug Data'}
      </button>
      
      {isOpen && (
        <div className="bg-gray-900 text-gray-300 rounded-lg shadow-xl p-4 mt-2 w-96 max-h-[80vh] overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
          
          <div className="mb-4">
            <h3 className="text-md font-medium mb-1">Sample PDFs ({pdfs.length} total)</h3>
            <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(samplePdfs, null, 2)}
            </pre>
          </div>
          
          <div className="mb-4">
            <h3 className="text-md font-medium mb-1">Folders ({folders.length} total)</h3>
            <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(folders, null, 2)}
            </pre>
          </div>
          
          <div className="mb-4">
            <h3 className="text-md font-medium mb-1">Tags ({tags.length} total)</h3>
            <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(tags, null, 2)}
            </pre>
          </div>
          
          <button
            onClick={() => {
              const debugData = {
                pdfs: samplePdfs,
                folders,
                tags
              };
              navigator.clipboard.writeText(JSON.stringify(debugData, null, 2));
              alert('Debug data copied to clipboard!');
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded-md"
          >
            Copy Debug Data
          </button>
        </div>
      )}
    </div>
  );
};

export default DebugPanel