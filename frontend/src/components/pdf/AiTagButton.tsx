import React, { useState } from 'react';
import { extractTextFromPDFUrl } from '../../utils/pdf-utils';

interface AiTagButtonProps {
  pdfUrl: string;
  onTagsGenerated: (tags: string[]) => void;
}

const AiTagButton: React.FC<AiTagButtonProps> = ({ pdfUrl, onTagsGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTags = async () => {
    if (!pdfUrl) return;
    
    setIsGenerating(true);
    try {
      // Extract text from the PDF
      const text = await extractTextFromPDFUrl(pdfUrl);
      
      // Send text to the API for tag generation
      const response = await fetch('/api/tags/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }
      
      const { tags } = await response.json();
      
      // Call the callback with the generated tags
      onTagsGenerated(tags);
    } catch (error) {
      console.error('Tag generation failed:', error);
      alert('Failed to generate tags. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateTags}
      disabled={isGenerating}
      className={`px-3 py-1 rounded-md ${
        isGenerating 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700'
      } text-white flex items-center`}
    >
      <svg 
        className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
        />
      </svg>
      {isGenerating ? 'Generating...' : 'Auto-Tag'}
    </button>
  );
};

export default AiTagButton;