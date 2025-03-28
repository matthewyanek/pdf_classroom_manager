// src/components/layout/MainContent.tsx
import React from 'react';
import PDFList from '../pdf/PDFList';
import { PDF } from '../../types/pdf';

type MainContentProps = {
  pdfs: PDF[];
  loading: boolean;
  selectedPDFs: number[];
  onPDFSelection: (pdfId: number, isSelected: boolean) => void;
  onViewPDF: (pdfId: number, filename: string) => void;
  onDownloadPDF: (pdfId: number, filename: string) => void;
  onDeletePDF: (pdfId: number) => void;
  onUpdateTags: (pdfId: number, tags: string[]) => void;
  allTags: string[];
  apiError: string | null;
  // Remove onRefresh if it's not needed or add it to PDFListProps
};

const MainContent: React.FC<MainContentProps> = ({
  pdfs,
  loading,
  selectedPDFs,
  onPDFSelection,
  onViewPDF,
  onDownloadPDF,
  onDeletePDF,
  onUpdateTags,
  allTags,
  apiError
}) => {
  return (
    <div className="flex-1 overflow-auto bg-gray-900 p-4">
      {apiError && (
        <div className="bg-red-900 text-white p-3 rounded-md mb-4">
          Error: {apiError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : pdfs.length > 0 ? (
        <PDFList
          pdfs={pdfs}
          selectedPDFs={selectedPDFs}
          onPDFSelection={onPDFSelection}
          onViewPDF={onViewPDF}
          onDownloadPDF={onDownloadPDF}
          onDeletePDF={onDeletePDF}
          onUpdateTags={onUpdateTags}
          allTags={allTags}
          // Remove onRefresh={onRefresh} if it's not needed
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg
            className="w-16 h-16 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-xl">No PDFs found</p>
          <p className="mt-2">
            Upload some PDFs to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default MainContent;