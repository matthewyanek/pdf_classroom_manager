// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import FolderList from '../folder/FolderList';
import { Folder, Tag } from '../../types/pdf';

interface SidebarProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  selectedFolderId: number | undefined | null;
  selectedTag: string | null;
  handleFolderSelect: (folderId: number | undefined | null, folderName: string) => void;
  handleTagSelect: (tag: string | null) => void;
  refreshTrigger: number;
  setRefreshTrigger: () => void;
  folders: Folder[];
  unfiledCount: number;
  tags: Tag[];
  createFolder: (name: string) => Promise<any>;
  renameFolder?: (folderId: number, newName: string) => Promise<any>;
  deleteFolder?: (folderId: number) => Promise<any>;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarCollapsed,
  toggleSidebar,
  selectedFolderId,
  selectedTag,
  handleFolderSelect,
  handleTagSelect,
  refreshTrigger,
  setRefreshTrigger,
  folders,
  unfiledCount,
  tags,
  createFolder,
  renameFolder,
  deleteFolder
}) => {
  const [showFolders, setShowFolders] = useState(true);
  const [showTags, setShowTags] = useState(true);

  const toggleFolders = () => setShowFolders(!showFolders);
  const toggleTags = () => setShowTags(!showTags);

  return (
    <div
      className={`h-screen bg-gray-800 overflow-y-auto transition-all duration-300 ${
        sidebarCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'
      }`}
    >
      {!sidebarCollapsed && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-white">PDF Manager</h1>
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Folders Section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={toggleFolders}
            >
              <h2 className="text-lg font-semibold text-gray-300">FOLDERS</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-gray-400 transform transition-transform ${
                  showFolders ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            
            {showFolders && (
              <FolderList
                selectedFolderId={selectedFolderId}
                onSelectFolder={handleFolderSelect}
                onRefresh={setRefreshTrigger}
                refreshTrigger={refreshTrigger}
                folders={folders}
                unfiledCount={unfiledCount}
                onRenameFolder={renameFolder}
                onDeleteFolder={deleteFolder}
              />
            )}
          </div>

          {/* Tags Section */}
          <div>
            <div
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={toggleTags}
            >
              <h2 className="text-lg font-semibold text-gray-300">TAGS</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-gray-400 transform transition-transform ${
                  showTags ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            
            {showTags && (
              <div>
                <ul className="space-y-1 mb-4">
                  <li>
                    <button
                      onClick={() => handleTagSelect(null)}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        selectedTag === null
                          ? 'bg-blue-700 text-white'
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      All Tags
                    </button>
                  </li>
                  {tags.map(tag => (
                    <li key={tag.name}>
                      <button
                        onClick={() => handleTagSelect(tag.name)}
                        className={`w-full text-left px-3 py-2 rounded-md flex justify-between ${
                          selectedTag === tag.name
                            ? 'bg-blue-700 text-white'
                            : 'hover:bg-gray-700'
                        }`}
                      >
                        <span>{tag.name}</span>
                        <span className="text-gray-400">{tag.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;