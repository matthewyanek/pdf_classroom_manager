@echo off
echo Creating new folder structure for your React project...

:: Create folders
mkdir src\components\common
mkdir src\components\pdf
mkdir src\components\folder
mkdir src\hooks
mkdir src\services
mkdir src\utils
mkdir src\types

echo Folder structure created successfully!

:: Create type definition files
echo Creating type definitions...

echo // src/types/pdf.ts > src\types\pdf.ts
echo export interface PDF { >> src\types\pdf.ts
echo   id: number; >> src\types\pdf.ts
echo   filename: string; >> src\types\pdf.ts
echo   path: string; >> src\types\pdf.ts
echo   tags: string[]; >> src\types\pdf.ts
echo   folder_id: number ^| null; >> src\types\pdf.ts
echo   folder_name?: string; >> src\types\pdf.ts
echo   created_at: string; >> src\types\pdf.ts
echo   size?: string ^| number; >> src\types\pdf.ts
echo } >> src\types\pdf.ts

echo // src/types/folder.ts > src\types\folder.ts
echo export interface Folder { >> src\types\folder.ts
echo   id: number; >> src\types\folder.ts
echo   name: string; >> src\types\folder.ts
echo   pdf_count: number; >> src\types\folder.ts
echo } >> src\types\folder.ts

echo // src/types/tag.ts > src\types\tag.ts
echo export interface Tag { >> src\types\tag.ts
echo   id: number; >> src\types\tag.ts
echo   name: string; >> src\types\tag.ts
echo } >> src\types\tag.ts

:: Create API services
echo Creating API services...

echo // src/services/api.ts > src\services\api.ts
echo import axios from 'axios'; >> src\services\api.ts
echo. >> src\services\api.ts
echo // Create a base axios instance >> src\services\api.ts
echo const api = axios.create({ >> src\services\api.ts
echo   baseURL: 'http://localhost:8000/api', >> src\services\api.ts
echo }); >> src\services\api.ts
echo. >> src\services\api.ts
echo export default api; >> src\services\api.ts

echo // src/services/pdfService.ts > src\services\pdfService.ts
echo import api from './api'; >> src\services\pdfService.ts
echo import { PDF } from '../types/pdf'; >> src\services\pdfService.ts
echo. >> src\services\pdfService.ts
echo export const pdfService = { >> src\services\pdfService.ts
echo   // Get PDFs with optional filters >> src\services\pdfService.ts
echo   async getPDFs(params: { folder_id?: number ^| null; search?: string; tag?: string } = {}) { >> src\services\pdfService.ts
echo     // Special handling for "Unfiled" folder >> src\services\pdfService.ts
echo     if (params.folder_id === -1) { >> src\services\pdfService.ts
echo       params.folder_id = -1; // API uses -1 to indicate "Unfiled" >> src\services\pdfService.ts
echo     } >> src\services\pdfService.ts
echo     >> src\services\pdfService.ts
echo     const response = await api.get('/pdfs/', { params }); >> src\services\pdfService.ts
echo     return response.data as PDF[]; >> src\services\pdfService.ts
echo   }, >> src\services\pdfService.ts
echo. >> src\services\pdfService.ts
echo   // Get a single PDF by ID >> src\services\pdfService.ts
echo   async getPDF(id: number) { >> src\services\pdfService.ts
echo     const response = await api.get(`/pdfs/${id}`); >> src\services\pdfService.ts
echo     return response.data as PDF; >> src\services\pdfService.ts
echo   }, >> src\services\pdfService.ts
echo. >> src\services\pdfService.ts
echo   // Upload a PDF >> src\services\pdfService.ts
echo   async uploadPDF(file: File, tags: string, folder_id: number ^| null = null) { >> src\services\pdfService.ts
echo     const formData = new FormData(); >> src\services\pdfService.ts
echo     formData.append('file', file); >> src\services\pdfService.ts
echo     formData.append('tags', tags); >> src\services\pdfService.ts
echo     >> src\services\pdfService.ts
echo     if (folder_id !== null) { >> src\services\pdfService.ts
echo       formData.append('folder_id', folder_id.toString()); >> src\services\pdfService.ts
echo     } >> src\services\pdfService.ts
echo     >> src\services\pdfService.ts
echo     const response = await api.post('/pdfs/upload', formData, { >> src\services\pdfService.ts
echo       headers: { 'Content-Type': 'multipart/form-data' } >> src\services\pdfService.ts
echo     }); >> src\services\pdfService.ts
echo     >> src\services\pdfService.ts
echo     return response.data as PDF; >> src\services\pdfService.ts
echo   }, >> src\services\pdfService.ts
echo. >> src\services\pdfService.ts
echo   // Delete PDFs >> src\services\pdfService.ts
echo   async deletePDFs(pdfIds: number[]) { >> src\services\pdfService.ts
echo     const response = await api.post('/pdfs/delete', { pdf_ids: pdfIds }); >> src\services\pdfService.ts
echo     return response.data; >> src\services\pdfService.ts
echo   }, >> src\services\pdfService.ts
echo. >> src\services\pdfService.ts
echo   // Move PDFs to folder >> src\services\pdfService.ts
echo   async movePDFsToFolder(pdfIds: number[], folderId: number ^| null) { >> src\services\pdfService.ts
echo     const response = await api.post('/pdfs/move', { >> src\services\pdfService.ts
echo       pdf_ids: pdfIds, >> src\services\pdfService.ts
echo       folder_id: folderId >> src\services\pdfService.ts
echo     }); >> src\services\pdfService.ts
echo     return response.data; >> src\services\pdfService.ts
echo   }, >> src\services\pdfService.ts
echo. >> src\services\pdfService.ts
echo   // Get unfiled count >> src\services\pdfService.ts
echo   async getUnfiledCount() { >> src\services\pdfService.ts
echo     const response = await api.get('/pdfs/unfiled-count'); >> src\services\pdfService.ts
echo     return response.data.count as number; >> src\services\pdfService.ts
echo   }, >> src\services\pdfService.ts
echo. >> src\services\pdfService.ts
echo   // Update PDF tags >> src\services\pdfService.ts
echo   async updateTags(pdfId: number, tags: string[]) { >> src\services\pdfService.ts
echo     const response = await api.put(`/pdfs/${pdfId}/tags`, { >> src\services\pdfService.ts
echo       tags: tags.join(',') >> src\services\pdfService.ts
echo     }); >> src\services\pdfService.ts
echo     return response.data; >> src\services\pdfService.ts
echo   } >> src\services\pdfService.ts
echo }; >> src\services\pdfService.ts

echo // src/services/folderService.ts > src\services\folderService.ts
echo import api from './api'; >> src\services\folderService.ts
echo import { Folder } from '../types/folder'; >> src\services\folderService.ts
echo. >> src\services\folderService.ts
echo export const folderService = { >> src\services\folderService.ts
echo   // Get all folders >> src\services\folderService.ts
echo   async getFolders() { >> src\services\folderService.ts
echo     const response = await api.get('/folders/'); >> src\services\folderService.ts
echo     return response.data.folders as Folder[]; >> src\services\folderService.ts
echo   }, >> src\services\folderService.ts
echo. >> src\services\folderService.ts
echo   // Create a new folder >> src\services\folderService.ts
echo   async createFolder(name: string) { >> src\services\folderService.ts
echo     const response = await api.post('/folders/', { name }); >> src\services\folderService.ts
echo     return response.data as Folder; >> src\services\folderService.ts
echo   }, >> src\services\folderService.ts
echo. >> src\services\folderService.ts
echo   // Delete a folder >> src\services\folderService.ts
echo   async deleteFolder(id: number) { >> src\services\folderService.ts
echo     const response = await api.delete(`/folders/${id}`); >> src\services\folderService.ts
echo     return response.data; >> src\services\folderService.ts
echo   }, >> src\services\folderService.ts
echo. >> src\services\folderService.ts
echo   // Rename a folder >> src\services\folderService.ts
echo   async renameFolder(id: number, name: string) { >> src\services\folderService.ts
echo     const response = await api.put(`/folders/${id}`, { name }); >> src\services\folderService.ts
echo     return response.data as Folder; >> src\services\folderService.ts
echo   } >> src\services\folderService.ts
echo }; >> src\services\folderService.ts

echo // src/services/tagService.ts > src\services\tagService.ts
echo import api from './api'; >> src\services\tagService.ts
echo import { Tag } from '../types/tag'; >> src\services\tagService.ts
echo. >> src\services\tagService.ts
echo export const tagService = { >> src\services\tagService.ts
echo   // Get all tags >> src\services\tagService.ts
echo   async getTags() { >> src\services\tagService.ts
echo     const response = await api.get('/tags/'); >> src\services\tagService.ts
echo     return response.data as Tag[]; >> src\services\tagService.ts
echo   } >> src\services\tagService.ts
echo }; >> src\services\tagService.ts

:: Create hooks
echo Creating custom hooks...

echo // src/hooks/usePDFs.ts > src\hooks\usePDFs.ts
echo import { useState, useEffect, useCallback } from 'react'; >> src\hooks\usePDFs.ts
echo import { pdfService } from '../services/pdfService'; >> src\hooks\usePDFs.ts
echo import { PDF } from '../types/pdf'; >> src\hooks\usePDFs.ts
echo. >> src\hooks\usePDFs.ts
echo export function usePDFs(initialFolderId?: number ^| null, initialSearchQuery = '') { >> src\hooks\usePDFs.ts
echo   const [pdfs, setPdfs] = useState^<PDF[]^>([]); >> src\hooks\usePDFs.ts
echo   const [loading, setLoading] = useState(false); >> src\hooks\usePDFs.ts
echo   const [error, setError] = useState^<string ^| null^>(null); >> src\hooks\usePDFs.ts
echo   const [selectedPDFs, setSelectedPDFs] = useState^<number[]^>([]); >> src\hooks\usePDFs.ts
echo   const [refreshTrigger, setRefreshTrigger] = useState(0); >> src\hooks\usePDFs.ts
echo   const [searchQuery, setSearchQuery] = useState(initialSearchQuery); >> src\hooks\usePDFs.ts
echo. >> src\hooks\usePDFs.ts
echo   // Fetch PDFs based on folder, search, and tag >> src\hooks\usePDFs.ts
echo   const fetchPDFs = useCallback(async ( >> src\hooks\usePDFs.ts
echo     folderId?: number ^| null,  >> src\hooks\usePDFs.ts
echo     search?: string,  >> src\hooks\usePDFs.ts
echo     tag?: string ^| null >> src\hooks\usePDFs.ts
echo   ) => { >> src\hooks\usePDFs.ts
echo     try { >> src\hooks\usePDFs.ts
echo       setLoading(true); >> src\hooks\usePDFs.ts
echo       setError(null); >> src\hooks\usePDFs.ts
echo       >> src\hooks\usePDFs.ts
echo       const params: any = {}; >> src\hooks\usePDFs.ts
echo       >> src\hooks\usePDFs.ts
echo       if (folderId !== undefined) { >> src\hooks\usePDFs.ts
echo         params.folder_id = folderId; >> src\hooks\usePDFs.ts
echo       } >> src\hooks\usePDFs.ts
echo       >> src\hooks\usePDFs.ts
echo       if (search) { >> src\hooks\usePDFs.ts
echo         params.search = search; >> src\hooks\usePDFs.ts
echo       } >> src\hooks\usePDFs.ts
echo       >> src\hooks\usePDFs.ts
echo       if (tag) { >> src\hooks\usePDFs.ts
echo         params.tag = tag; >> src\hooks\usePDFs.ts
echo       } >> src\hooks\usePDFs.ts
echo       >> src\hooks\usePDFs.ts
echo       const data = await pdfService.getPDFs(params); >> src\hooks\usePDFs.ts
echo       setPdfs(data); >> src\hooks\usePDFs.ts
echo     } catch (err) { >> src\hooks\usePDFs.ts
echo       console.error('Error fetching PDFs:', err); >> src\hooks\usePDFs.ts
echo       setError('Failed to load PDFs'); >> src\hooks\usePDFs.ts
echo     } finally { >> src\hooks\usePDFs.ts
echo       setLoading(false); >> src\hooks\usePDFs.ts
echo     } >> src\hooks\usePDFs.ts
echo   }, []); >> src\hooks\usePDFs.ts
echo. >> src\hooks\usePDFs.ts
echo   // Fetch PDFs when refresh trigger changes >> src\hooks\usePDFs.ts
echo   useEffect(() => { >> src\hooks\usePDFs.ts
echo     fetchPDFs(initialFolderId, searchQuery); >> src\hooks\usePDFs.ts
echo   }, [fetchPDFs, initialFolderId, searchQuery, refreshTrigger]); >> src\hooks\usePDFs.ts
echo. >> src\hooks\usePDFs.ts
echo   // Handle PDF selection >> src\hooks\usePDFs.ts
echo   const handlePDFSelection = useCallback((pdfId: number, isSelected: boolean) => { >> src\hooks\usePDFs.ts
echo     if (pdfId === -1) { >> src\hooks\usePDFs.ts
echo       // Special case: -1 means clear all selections >> src\hooks\usePDFs.ts
echo       setSelectedPDFs([]); >> src\hooks\usePDFs.ts
echo       return; >> src\hooks\usePDFs.ts
echo     } >> src\hooks\usePDFs.ts
echo     >> src\hooks\usePDFs.ts
echo     if (isSelected) { >> src\hooks\usePDFs.ts
echo       setSelectedPDFs(prev => [...prev, pdfId]); >> src\hooks\usePDFs.ts
echo     } else { >> src\hooks\usePDFs.ts
echo       setSelectedPDFs(prev => prev.filter(id => id !== pdfId)); >> src\hooks\usePDFs.ts
echo     } >> src\hooks\usePDFs.ts
echo   }, []); >> src\hooks\usePDFs.ts
echo. >> src\hooks\usePDFs.ts
echo   // Clear selection >> src\hooks\usePDFs.ts
echo   const clearSelection = useCallback(() => { >> src\hooks\usePDFs.ts
echo     setSelectedPDFs([]); >> src\hooks\usePDFs.ts
echo   }, []); >> src\hooks\usePDFs.ts
echo. >> src\hooks\usePDFs.ts
echo   // Delete selected PDFs >> src\hooks\usePDFs.ts
echo   const deleteSelectedPDFs = useCallback(async () => { >> src\hooks\usePDFs.ts
echo     if (selectedPDFs.length === 0) return; >> src\hooks\usePDFs.ts
echo     >> src\hooks\usePDFs.ts
echo     try { >> src\hooks\usePDFs.ts
echo       await pdfService.deletePDFs(selectedPDFs); >> src\hooks\usePDFs.ts
echo       clearSelection(); >> src\hooks\usePDFs.ts
echo       setRefreshTrigger(prev => prev + 1); >> src\hooks\usePDFs.ts
echo       return true; >> src\hooks\usePDFs.ts
echo     } catch (err) { >> src\hooks\usePDFs.ts
echo       console.error('Error deleting PDFs:', err); >> src\hooks\usePDFs.ts
echo       setError('Failed to delete PDFs'); >> src\hooks\usePDFs.ts
echo       return false; >> src\hooks\usePDFs.ts
echo     } >> src\hooks\usePDFs.ts
echo   }, [selectedPDFs, clearSelection]); >> src\hooks\usePDFs.ts
echo. >> src\hooks\usePDFs.ts
echo   // Move selected PDFs to folder >> src\hooks\usePDFs.ts
echo   const moveSelectedPDFsToFolder = useCallback(async (folderId: number ^| null) => { >> src\hooks\usePDFs.ts
echo     if (selectedPDFs.length === 0) return; >> src\hooks\usePDFs.ts
echo     >> src\hooks\usePDFs.ts
echo     try { >> src\hooks\usePDFs.ts
echo       await pdfService.movePDFsToFolder(selectedPDFs, folderId); >> src\hooks\usePDFs.ts
echo       clearSelection(); >> src\hooks\usePDFs.ts
echo       setRefreshTrigger(prev => prev + 1); >> src\hooks\usePDFs.ts
echo       return true; >> src\hooks\usePDFs.ts
echo     } catch (err) { >> src\hooks\usePDFs.ts
echo       console.error('Error moving PDFs:', err); >> src\hooks\usePDFs.ts
echo       setError('Failed to move PDFs'); >> src\hooks\usePDFs.ts
echo       return false; >> src\hooks\usePDFs.ts
echo     } >> src\hooks\usePDFs.ts
echo   }, [selectedPDFs, clearSelection]); >> src\hooks\usePDFs.ts
echo. >> src\hooks\usePDFs.ts
echo   return { >> src\hooks\usePDFs.ts
echo     pdfs, >> src\hooks\usePDFs.ts
echo     loading, >> src\hooks\usePDFs.ts
echo     error, >> src\hooks\usePDFs.ts
echo     selectedPDFs, >> src\hooks\usePDFs.ts
echo     searchQuery, >> src\hooks\usePDFs.ts
echo     setSearchQuery, >> src\hooks\usePDFs.ts
echo     fetchPDFs, >> src\hooks\usePDFs.ts
echo     handlePDFSelection, >> src\hooks\usePDFs.ts
echo     clearSelection, >> src\hooks\usePDFs.ts
echo     deleteSelectedPDFs, >> src\hooks\usePDFs.ts
echo     moveSelectedPDFsToFolder, >> src\hooks\usePDFs.ts
echo     refreshPDFs: () => setRefreshTrigger(prev => prev + 1) >> src\hooks\usePDFs.ts
echo   }; >> src\hooks\usePDFs.ts
echo } >> src\hooks\usePDFs.ts

echo // src/hooks/useFolders.ts > src\hooks\useFolders.ts
echo import { useState, useEffect, useCallback } from 'react'; >> src\hooks\useFolders.ts
echo import { folderService } from '../services/folderService'; >> src\hooks\useFolders.ts
echo import { Folder } from '../types/folder'; >> src\hooks\useFolders.ts
echo. >> src\hooks\useFolders.ts
echo export function useFolders() { >> src\hooks\useFolders.ts
echo   const [folders, setFolders] = useState^<Folder[]^>([]); >> src\hooks\useFolders.ts
echo   const [loading, setLoading] = useState(false); >> src\hooks\useFolders.ts
echo   const [error, setError] = useState^<string ^| null^>(null); >> src\hooks\useFolders.ts
echo   const [refreshTrigger, setRefreshTrigger] = useState(0); >> src\hooks\useFolders.ts
echo. >> src\hooks\useFolders.ts
echo   const fetchFolders = useCallback(async () => { >> src\hooks\useFolders.ts
echo     try { >> src\hooks\useFolders.ts
echo       setLoading(true); >> src\hooks\useFolders.ts
echo       setError(null); >> src\hooks\useFolders.ts
echo       const data = await folderService.getFolders(); >> src\hooks\useFolders.ts
echo       setFolders(data); >> src\hooks\useFolders.ts
echo     } catch (err) { >> src\hooks\useFolders.ts
echo       console.error('Error fetching folders:', err); >> src\hooks\useFolders.ts
echo       setError('Failed to load folders'); >> src\hooks\useFolders.ts
echo     } finally { >> src\hooks\useFolders.ts
echo       setLoading(false); >> src\hooks\useFolders.ts
echo     } >> src\hooks\useFolders.ts
echo   }, []); >> src\hooks\useFolders.ts
echo. >> src\hooks\useFolders.ts
echo   useEffect(() => { >> src\hooks\useFolders.ts
echo     fetchFolders(); >> src\hooks\useFolders.ts
echo   }, [fetchFolders, refreshTrigger]); >> src\hooks\useFolders.ts
echo. >> src\hooks\useFolders.ts
echo   const createFolder = useCallback(async (name: string) => { >> src\hooks\useFolders.ts
echo     try { >> src\hooks\useFolders.ts
echo       await folderService.createFolder(name); >> src\hooks\useFolders.ts
echo       setRefreshTrigger(prev => prev + 1); >> src\hooks\useFolders.ts
echo       return true; >> src\hooks\useFolders.ts
echo     } catch (err) { >> src\hooks\useFolders.ts
echo       console.error('Error creating folder:', err); >> src\hooks\useFolders.ts
echo       setError('Failed to create folder'); >> src\hooks\useFolders.ts
echo       return false; >> src\hooks\useFolders.ts
echo     } >> src\hooks\useFolders.ts
echo   }, []); >> src\hooks\useFolders.ts
echo. >> src\hooks\useFolders.ts
echo   return { >> src\hooks\useFolders.ts
echo     folders, >> src\hooks\useFolders.ts
echo     loading, >> src\hooks\useFolders.ts
echo     error, >> src\hooks\useFolders.ts
echo     fetchFolders, >> src\hooks\useFolders.ts
echo     createFolder, >> src\hooks\useFolders.ts
echo     refreshFolders: () => setRefreshTrigger(prev => prev + 1) >> src\hooks\useFolders.ts
echo   }; >> src\hooks\useFolders.ts
echo } >> src\hooks\useFolders.ts

echo // src/hooks/useTags.ts > src\hooks\useTags.ts
echo import { useState, useEffect, useCallback } from 'react'; >> src\hooks\useTags.ts
echo import { tagService } from '../services/tagService'; >> src\hooks\useTags.ts
echo import { Tag } from '../types/tag'; >> src\hooks\useTags.ts
echo. >> src\hooks\useTags.ts
echo export function useTags() { >> src\hooks\useTags.ts
echo   const [tags, setTags] = useState^<Tag[]^>([]); >> src\hooks\useTags.ts
echo   const [loading, setLoading] = useState(false); >> src\hooks\useTags.ts
echo   const [error, setError] = useState^<string ^| null^>(null); >> src\hooks\useTags.ts
echo   const [refreshTrigger, setRefreshTrigger] = useState(0); >> src\hooks\useTags.ts
echo. >> src\hooks\useTags.ts
echo   const fetchTags = useCallback(async () => { >> src\hooks\useTags.ts
echo     try { >> src\hooks\useTags.ts
echo       setLoading(true); >> src\hooks\useTags.ts
echo       setError(null); >> src\hooks\useTags.ts
echo       const data = await tagService.getTags(); >> src\hooks\useTags.ts
echo       setTags(data); >> src\hooks\useTags.ts
echo     } catch (err) { >> src\hooks\useTags.ts
echo       console.error('Error fetching tags:', err); >> src\hooks\useTags.ts
echo       setError('Failed to load tags'); >> src\hooks\useTags.ts
echo     } finally { >> src\hooks\useTags.ts
echo       setLoading(false); >> src\hooks\useTags.ts
echo     } >> src\hooks\useTags.ts
echo   }, []); >> src\hooks\useTags.ts
echo. >> src\hooks\useTags.ts
echo   useEffect(() => { >> src\hooks\useTags.ts
echo     fetchTags(); >> src\hooks\useTags.ts
echo   }, [fetchTags, refreshTrigger]); >> src\hooks\useTags.ts
echo. >> src\hooks\useTags.ts
echo   return { >> src\hooks\useTags.ts
echo     tags, >> src\hooks\useTags.ts
echo     loading, >> src\hooks\useTags.ts
echo     error, >> src\hooks\useTags.ts
echo     fetchTags, >> src\hooks\useTags.ts
echo     refreshTags: () => setRefreshTrigger(prev => prev + 1) >> src\hooks\useTags.ts
echo   }; >> src\hooks\useTags.ts
echo } >> src\hooks\useTags.ts

:: Create utility files
echo Creating utility files...

echo // src/utils/formatters.ts > src\utils\formatters.ts
echo export const formatFileSize = (bytes?: number ^| null): string => { >> src\utils\formatters.ts
echo   if (bytes === undefined ^|| bytes === null) return 'N/A'; >> src\utils\formatters.ts
echo   if (bytes === 0) return '0 Bytes'; >> src\utils\formatters.ts
echo   >> src\utils\formatters.ts
echo   const k = 1024; >> src\utils\formatters.ts
echo   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']; >> src\utils\formatters.ts
echo   const i = Math.floor(Math.log(bytes) / Math.log(k)); >> src\utils\formatters.ts
echo   >> src\utils\formatters.ts
echo   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; >> src\utils\formatters.ts
echo }; >> src\utils\formatters.ts
echo. >> src\utils\formatters.ts
echo export const formatDate = (dateString?: string): string => { >> src\utils\formatters.ts
echo   if (!dateString) return 'N/A'; >> src\utils\formatters.ts
echo   >> src\utils\formatters.ts
echo   try { >> src\utils\formatters.ts
echo     const date = new Date(dateString); >> src\utils\formatters.ts
echo     return date.toLocaleDateString('en-US', { >> src\utils\formatters.ts
echo       year: 'numeric', >> src\utils\formatters.ts
echo       month: '2-digit', >> src\utils\formatters.ts
echo       day: '2-digit' >> src\utils\formatters.ts
echo     }); >> src\utils\formatters.ts
echo   } catch (e) { >> src\utils\formatters.ts
echo     return 'N/A'; >> src\utils\formatters.ts
echo   } >> src\utils\formatters.ts
echo }; >> src\utils\formatters.ts

echo // src/utils/colors.ts > src\utils\colors.ts
echo export const getFolderColor = (folderId: number): string => { >> src\utils\colors.ts
echo   // List of pleasant, distinguishable colors >> src\utils\colors.ts
echo   const colors = [ >> src\utils\colors.ts
echo     '#4299E1', // blue >> src\utils\colors.ts
echo     '#48BB78', // green >> src\utils\colors.ts
echo     '#ED8936', // orange >> src\utils\colors.ts
echo     '#9F7AEA', // purple >> src\utils\colors.ts
echo     '#F56565', // red >> src\utils\colors.ts
echo     '#38B2AC', // teal >> src\utils\colors.ts
echo     '#D53F8C', // pink >> src\utils\colors.ts
echo     '#805AD5'  // indigo >> src\utils\colors.ts
echo   ]; >> src\utils\colors.ts
echo   >> src\utils\colors.ts
echo   // Use folder ID to pick a color >> src\utils\colors.ts
echo   const index = folderId %% colors.length; >> src\utils\colors.ts
echo   return colors[index]; >> src\utils\colors.ts
echo }; >> src\utils\colors.ts

echo All files created successfully!
echo.
echo Next steps:
echo 1. Move PDFListStyled.tsx to components/pdf/PDFList.tsx
echo 2. Move PDFUploadButton.tsx to components/pdf/PDFUpload.tsx
echo 3. Update imports in MainContent.tsx and other components
echo.
echo Done!