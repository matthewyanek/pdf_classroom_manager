// src/components/pdf/PDFViewer.tsx
import React, { useState, useEffect } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
  filename: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, filename, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [pdfObjectUrl, setPdfObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the PDF as a blob and create an object URL
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        console.log('Fetching PDF from:', pdfUrl);
        const response = await fetch(pdfUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        console.log('PDF blob created, size:', blob.size);
        const objectUrl = URL.createObjectURL(blob);
        setPdfObjectUrl(objectUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
        setLoading(false);
      }
    };
    
    fetchPdf();
    
    // Clean up object URL when component unmounts
    return () => {
      if (pdfObjectUrl) {
        URL.revokeObjectURL(pdfObjectUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl flex flex-col w-11/12 h-5/6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white truncate">{filename}</h2>
          <div className="flex space-x-3">
            <a
              href={pdfUrl.replace('/view', '/download')}
              download={filename}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-900 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl mb-2">Error Loading PDF</p>
              <p className="text-gray-400 text-center max-w-md">{error}</p>
              <p className="mt-4 text-sm text-gray-500">Try downloading the file instead.</p>
            </div>
          ) : (
            pdfObjectUrl && (
              <iframe 
                src={pdfObjectUrl} 
                className="w-full h-full" 
                title={filename}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;