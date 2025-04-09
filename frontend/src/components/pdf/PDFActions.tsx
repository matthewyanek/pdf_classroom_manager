// src/components/pdf/PDFActions.tsx
import { useState } from 'react';
import { PDF } from '../../types/pdf';
import { pdfService } from '../../services/pdfService';
import EditPdfModal from './EditPdfModal';

interface PDFActionsProps {
  pdf: PDF;
  onView: (pdfId: number, filename: string) => void;
  onDownload: (pdfId: number, filename: string) => void;
  onDelete: (pdfId: number) => void;
  onRefresh: () => void;
}

const PDFActions: React.FC<PDFActionsProps> = ({
  pdf,
  onView,
  onDownload,
  onDelete,
  onRefresh
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  return (
    <>
      <div className="absolute bottom-2 right-2 flex space-x-1">
        <button
          onClick={() => onView(pdf.id, pdf.filename)}
          className="p-1 text-gray-400 hover:text-blue-400 rounded-md"
          title="View PDF"
        >
          <svg
            className="w-4 h-4"
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
          onClick={() => onDownload(pdf.id, pdf.filename)}
          className="p-1 text-gray-400 hover:text-green-400 rounded-md"
          title="Download PDF"
        >
          <svg
            className="w-4 h-4"
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
          onClick={() => setShowEditModal(true)}
          className="p-1 text-gray-400 hover:text-yellow-400 rounded-md"
          title="Edit PDF"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(pdf.id)}
          className="p-1 text-gray-400 hover:text-red-400 rounded-md"
          title="Delete PDF"
        >
          <svg
            className="w-4 h-4"
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
      </div>

      {showEditModal && (
        <EditPdfModal
          pdf={pdf}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            setShowEditModal(false);
            onRefresh();
          }}
        />
      )}
    </>
  );
};

export default PDFActions;