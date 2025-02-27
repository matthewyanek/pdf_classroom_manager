import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import EditPdfModal from '../components/pdf/EditPdfModal';
import BatchOperationsBar from '../components/pdf/BatchOperationsBar';

// Import the PDF viewer dynamically to avoid SSR issues
const PdfViewer = dynamic(() => import('../components/pdf/PdfViewer'), {
  ssr: false
});

export default function Home() {
  const [file, setFile] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [viewingPdf, setViewingPdf] = useState(null);
  const [editingPdf, setEditingPdf] = useState(null);
  const [selectedPdfIds, setSelectedPdfIds] = useState<number[]>([]);

  // Fetch PDFs on load
  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async (searchTerm = '') => {
    try {
      const url = searchTerm 
        ? `http://localhost:8000/api/pdfs/?search=${encodeURIComponent(searchTerm)}`
        : 'http://localhost:8000/api/pdfs/';
      
      const response = await axios.get(url);
      setPdfs(response.data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    setMessage('');
    
    try {
      await axios.post('http://localhost:8000/api/pdfs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage('PDF uploaded successfully!');
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Refresh PDF list
      fetchPdfs();
    } catch (error) {
      setMessage('Error uploading PDF. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPdfs(search);
  };

  const handleViewPdf = (pdfId) => {
    setViewingPdf(`http://localhost:8000/api/pdfs/${pdfId}/view`);
  };

  const handleEditPdf = (pdf) => {
    setEditingPdf(pdf);
  };

  const handleDownloadPdf = (pdfId, filename) => {
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = `http://localhost:8000/api/pdfs/${pdfId}/download`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePdfSelection = (pdfId) => {
    setSelectedPdfIds(prev => {
      if (prev.includes(pdfId)) {
        return prev.filter(id => id !== pdfId);
      } else {
        return [...prev, pdfId];
      }
    });
  };

  const clearSelection = () => {
    setSelectedPdfIds([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            PDF Classroom Manager
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Upload, tag, and search your classroom worksheets
          </p>
        </div>

        {/* Upload Section */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload New Worksheet</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`px-4 py-2 rounded-md text-white ${
                !file || loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search Worksheets</h2>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by filename or tag..."
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Worksheet List Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Worksheets</h2>
            {selectedPdfIds.length > 0 && (
              <button 
                onClick={clearSelection}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection ({selectedPdfIds.length})
              </button>
            )}
          </div>
          
          {selectedPdfIds.length > 0 && (
            <BatchOperationsBar 
              selectedPdfIds={selectedPdfIds} 
              clearSelection={clearSelection} 
              refreshPdfs={() => fetchPdfs(search)}
            />
          )}
          
          {pdfs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No PDFs found. Upload your first worksheet above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        checked={selectedPdfIds.length > 0 && selectedPdfIds.length === pdfs.length}
                        onChange={() => {
                          if (selectedPdfIds.length === pdfs.length) {
                            setSelectedPdfIds([]);
                          } else {
                            setSelectedPdfIds(pdfs.map(pdf => pdf.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filename
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pdfs.map((pdf) => (
                    <tr key={pdf.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedPdfIds.includes(pdf.id)}
                          onChange={() => togglePdfSelection(pdf.id)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{pdf.filename}</div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-1">
                          {pdf.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewPdf(pdf.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditPdf(pdf)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(pdf.id, pdf.filename)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <PdfViewer
          pdfUrl={viewingPdf}
          onClose={() => setViewingPdf(null)}
        />
      )}

      {/* Edit PDF Modal */}
      {editingPdf && (
        <EditPdfModal
          pdf={editingPdf}
          onClose={() => setEditingPdf(null)}
          onSave={() => {
            fetchPdfs(search);
            setEditingPdf(null);
          }}
        />
      )}
    </div>
  );
}