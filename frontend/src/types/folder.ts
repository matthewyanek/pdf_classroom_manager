// src/types/pdf.ts
export interface PDF {
  id: number;
  filename: string;
  path: string;
  tags: string[];
  folder_id: number | null;
  folder_name?: string;
  created_at: string;
  size?: string | number;
}