// src/components/pdf/PDFList.tsx
import React from 'react';
import { PDF } from '../../types/pdf';

// Define the props interface
export interface PDFListProps {
  pdfs: PDF[];
  selectedPDFs: number[];
  onPDFSelection: (pdfId: number, isSelected: boolean) => void;
  onViewPDF: (pdfId: number, filename: string) => void;
  onDownloadPDF: (pdfId: number, filename: string) => void;
  onDeletePDF: (pdfId: number) => void;
  onUpdateTags: (pdfId: number, tags: string[]) => void;
  allTags?: string[];
  loading?: boolean;
  onEditTags?: (pdfId: number, tags: string[]) => void;
  apiError?: string | null;
}

// Define the component
const PDFList: React.FC<PDFListProps> = ({
  pdfs,
  selectedPDFs,
  onPDFSelection,
  onViewPDF,
  onDownloadPDF,
  onDeletePDF,
  onUpdateTags,
  allTags = []
}) => {
  console.log('PDFList rendering with:', {
    pdfs: pdfs.length,
    selectedPDFs: selectedPDFs.length
  });
  
  if (pdfs.length > 0) {
    console.log('Sample PDF data:', pdfs[0]);
  }
  
  return (
    <div className="space-y-4">
      {pdfs.map((pdf) => (
        <div
          key={pdf.id}
          className={`p-4 bg-gray-800 rounded-lg shadow-md ${
            selectedPDFs.includes(pdf.id) ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white">{pdf.filename}</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {pdf.tags && pdf.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onViewPDF(pdf.id, pdf.filename)}
                className="p-2 text-gray-400 hover:text-blue-400 rounded-md"
                title="View PDF"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDownloadPDF(pdf.id, pdf.filename)}
                className="p-2 text-gray-400 hover:text-green-400 rounded-md"
                title="Download PDF"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDeletePDF(pdf.id)}
                className="p-2 text-gray-400 hover:text-red-400 rounded-md"
                title="Delete PDF"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => onPDFSelection(pdf.id, !selectedPDFs.includes(pdf.id))}
                className={`p-2 rounded-md ${
                  selectedPDFs.includes(pdf.id)
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-gray-400 hover:text-white'
                }`}
                title={selectedPDFs.includes(pdf.id) ? 'Deselect' : 'Select'}
              >
                <svg
                  className="w-5 h-5"
                  fill={selectedPDFs.includes(pdf.id) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Export the component
export default PDFList;