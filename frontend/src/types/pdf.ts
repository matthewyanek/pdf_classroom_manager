// src/types/pdf.ts
export interface PDF {
  id: number;
  filename: string;
  folder_id: number | null;
  folder_name?: string;
  tags: string[];
  date_added?: string;
  size?: number;
}

export interface Folder {
  id: number;
  name: string;
  pdf_count: number;
  color?: string; // Add color property
}

export interface Tag {
  name: string;
  count: number;
}