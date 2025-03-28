// src/utils/normalize.ts

import { PDF, Folder, Tag } from '../types/pdf';

/**
 * Normalizes a PDF object to ensure consistent data format
 * @param pdf The PDF object to normalize
 * @returns A normalized PDF object
 */
export function normalizePDF(pdf: any): PDF {
  if (!pdf) {
    throw new Error('Cannot normalize null or undefined PDF');
  }
  
  // Normalize date_added field
  let normalizedDate = new Date().toISOString();
  
  if (pdf.date_added) {
    try {
      if (typeof pdf.date_added === 'string') {
        if (/^\d+$/.test(pdf.date_added)) {
          // It's a numeric string (timestamp)
          const timestamp = parseInt(pdf.date_added);
          const date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
          if (!isNaN(date.getTime())) {
            normalizedDate = date.toISOString();
          }
        } else {
          // It's a date string (ISO or other format)
          const date = new Date(pdf.date_added);
          if (!isNaN(date.getTime())) {
            normalizedDate = date.toISOString();
          }
        }
      } else if (typeof pdf.date_added === 'number') {
        // It's a timestamp number
        const date = new Date(pdf.date_added < 10000000000 ? pdf.date_added * 1000 : pdf.date_added);
        if (!isNaN(date.getTime())) {
          normalizedDate = date.toISOString();
        }
      } else if (pdf.date_added instanceof Date) {
        // It's already a Date object
        normalizedDate = pdf.date_added.toISOString();
      }
    } catch (e) {
      console.error('Error normalizing date:', e);
    }
  } else if (pdf.created_at) {
    // Use created_at as fallback if date_added is not available
    try {
      const date = new Date(pdf.created_at);
      if (!isNaN(date.getTime())) {
        normalizedDate = date.toISOString();
      }
    } catch (e) {
      console.error('Error normalizing created_at date:', e);
    }
  }
  
  // Ensure tags is an array
  const normalizedTags = Array.isArray(pdf.tags) ? pdf.tags : [];
  
  // Ensure folder_id is a number or null
  let normalizedFolderId = null;
  if (pdf.folder_id !== undefined && pdf.folder_id !== null) {
    normalizedFolderId = typeof pdf.folder_id === 'number' 
      ? pdf.folder_id 
      : parseInt(pdf.folder_id);
    
    // If parseInt failed, default to null
    if (isNaN(normalizedFolderId)) {
      normalizedFolderId = null;
    }
  }
  
  return {
    id: typeof pdf.id === 'number' ? pdf.id : parseInt(pdf.id) || 0,
    filename: pdf.filename || 'Unnamed PDF',
    date_added: normalizedDate,
    folder_id: normalizedFolderId,
    folder_name: pdf.folder_name || null,
    tags: normalizedTags
  };
}

/**
 * Normalizes a Folder object to ensure consistent data format
 * @param folder The Folder object to normalize
 * @returns A normalized Folder object
 */
export function normalizeFolder(folder: any): Folder {
  if (!folder) {
    throw new Error('Cannot normalize null or undefined Folder');
  }
  
  return {
    id: typeof folder.id === 'number' ? folder.id : parseInt(folder.id) || 0,
    name: folder.name || 'Unnamed Folder',
    pdf_count: typeof folder.pdf_count === 'number' ? folder.pdf_count : parseInt(folder.pdf_count) || 0
  };
}

/**
 * Normalizes a Tag object to ensure consistent data format
 * @param tag The Tag object to normalize
 * @returns A normalized Tag object
 */
export function normalizeTag(tag: any): Tag {
  if (!tag) {
    throw new Error('Cannot normalize null or undefined Tag');
  }
  
  return {
    name: tag.name || '',
    count: typeof tag.count === 'number' ? tag.count : parseInt(tag.count) || 0
  };
}

/**
 * Batch normalizes multiple PDFs
 * @param pdfs Array of PDF objects to normalize
 * @returns Array of normalized PDF objects
 */
export function normalizePDFs(pdfs: any[]): PDF[] {
  if (!Array.isArray(pdfs)) {
    console.error('Expected array of PDFs but got:', pdfs);
    return [];
  }
  
  return pdfs.map(pdf => {
    try {
      return normalizePDF(pdf);
    } catch (e) {
      console.error('Error normalizing PDF:', e, pdf);
      return null;
    }
  }).filter(Boolean) as PDF[];
}

/**
 * Batch normalizes multiple Folders
 * @param folders Array of Folder objects to normalize
 * @returns Array of normalized Folder objects
 */
export function normalizeFolders(folders: any[]): Folder[] {
  if (!Array.isArray(folders)) {
    console.error('Expected array of Folders but got:', folders);
    return [];
  }
  
  return folders.map(folder => {
    try {
      return normalizeFolder(folder);
    } catch (e) {
      console.error('Error normalizing Folder:', e, folder);
      return null;
    }
  }).filter(Boolean) as Folder[];
}

/**
 * Batch normalizes multiple Tags
 * @param tags Array of Tag objects to normalize
 * @returns Array of normalized Tag objects
 */
export function normalizeTags(tags: any[]): Tag[] {
  if (!Array.isArray(tags)) {
    console.error('Expected array of Tags but got:', tags);
    return [];
  }
  
  return tags.map(tag => {
    try {
      return normalizeTag(tag);
    } catch (e) {
      console.error('Error normalizing Tag:', e, tag);
      return null;
    }
  }).filter(Boolean) as Tag[];
}