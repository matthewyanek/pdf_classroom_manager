export interface PDF {
  id: number;
  filename: string;
  path: string;
  tags: string[];
  folder_id: number | null;
  folder_name: string | null;
  created_at: string;
}