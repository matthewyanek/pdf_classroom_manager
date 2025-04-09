// src/components/pdf/AiTagButton.tsx
import { useState } from 'react';
import axios from 'axios';

interface AiTagButtonProps {
  pdfId: number;
  onTagsGenerated: (tags: string[]) => void;
}

const AiTagButton: React.FC<AiTagButtonProps> = ({ pdfId, onTagsGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTags = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Use console.log to debug
      console.log('Generating tags for PDF ID:', pdfId);
      
      const response = await axios.post('/api/tags/generate', { pdf_id: pdfId });
      console.log('Tag generation response:', response.data);
      
      if (response.data && response.data.tags) {
        onTagsGenerated(response.data.tags);
      } else {
        setError('No tags were generated. Please try again.');
        console.error('No tags in response:', response.data);
      }
    } catch (error) {
      console.error('Error generating tags:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        // Log more details about the error
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        // Set a more specific error message if available
        if (error.response.data && error.response.data.detail) {
          setError(`Error: ${error.response.data.detail}`);
        } else {
          setError('Failed to generate tags. Please try again later.');
        }
      } else {
        setError('Failed to generate tags. Please try again later.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button
        onClick={generateTags}
        disabled={isGenerating}
        className={`px-3 py-1 rounded-md flex items-center ${
          isGenerating ? 'bg-blue-700 text-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Tags...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Auto-Generate Tags
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default AiTagButton;