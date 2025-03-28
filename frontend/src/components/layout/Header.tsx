// components/layout/ContentHeader.tsx
import React from 'react';

type ContentHeaderProps = {
  selectedFolderName: string;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const ContentHeader: React.FC<ContentHeaderProps> = ({
  selectedFolderName,
  loading,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
        <h2 className="text-xl font-bold mb-2 md:mb-0 text-gray-200">
          {selectedFolderName} {loading && <span className="text-sm text-gray-400">(Loading...)</span>}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Search PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;