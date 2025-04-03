// src/utils/pdf-utils.ts
import * as PDFJS from 'pdfjs-dist';

// Set the worker source
const pdfjsWorker = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extracts text content from a PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    return extractTextFromArrayBuffer(arrayBuffer);
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Fetches a PDF file from a URL and extracts its text
 */
export async function extractTextFromPDFUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return extractTextFromArrayBuffer(arrayBuffer);
  } catch (error) {
    console.error('Error extracting PDF text from URL:', error);
    throw new Error('Failed to extract text from PDF URL');
  }
}

/**
 * Helper function to extract text from an ArrayBuffer
 */
async function extractTextFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Load the PDF document
    const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page (up to first 10 pages for performance)
    const maxPages = Math.min(pdf.numPages, 10);
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + ' ';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error in PDF text extraction:', error);
    throw new Error('Failed to extract text from PDF');
  }
}