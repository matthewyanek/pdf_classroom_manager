@echo off
echo Moving and renaming components to the new structure...

:: First, create backup copies just in case
echo Creating backups of existing files...
mkdir backup-components
copy src\components\PDFListStyled.tsx backup-components\PDFListStyled.tsx
copy src\components\PDFUploadButton.tsx backup-components\PDFUploadButton.tsx

:: Now move the files to their new locations
echo Moving PDFListStyled.tsx to components/pdf/PDFList.tsx...
copy src\components\PDFListStyled.tsx src\components\pdf\PDFList.tsx
echo Moving PDFUploadButton.tsx to components/pdf/PDFUpload.tsx...
copy src\components\PDFUploadButton.tsx src\components\pdf\PDFUpload.tsx

:: Update imports in the new files
echo Updating imports in the new files...

:: Create a temporary file with updated imports for PDFList.tsx
type src\components\pdf\PDFList.tsx > temp_file.txt
powershell -Command "(Get-Content temp_file.txt) -replace 'import React', '// Updated imports\nimport React' | Set-Content src\components\pdf\PDFList.tsx"
del temp_file.txt

:: Create a temporary file with updated imports for PDFUpload.tsx
type src\components\pdf\PDFUpload.tsx > temp_file.txt
powershell -Command "(Get-Content temp_file.txt) -replace 'import React', '// Updated imports\nimport React' | Set-Content src\components\pdf\PDFUpload.tsx"
del temp_file.txt

:: Update MainContent.tsx to use the new imports
echo Updating imports in MainContent.tsx...
type src\components\layout\MainContent.tsx > temp_file.txt
powershell -Command "(Get-Content temp_file.txt) -replace 'import PDFListStyled from ''../PDFListStyled'';', 'import PDFList from ''../pdf/PDFList'';' | Set-Content src\components\layout\MainContent.tsx"
powershell -Command "(Get-Content src\components\layout\MainContent.tsx) -replace 'import PDFUploadButton from ''../PDFUploadButton'';', 'import PDFUpload from ''../pdf/PDFUpload'';' | Set-Content temp_file.txt"
powershell -Command "(Get-Content temp_file.txt) -replace '<PDFListStyled', '<PDFList' | Set-Content src\components\layout\MainContent.tsx"
powershell -Command "(Get-Content src\components\layout\MainContent.tsx) -replace '<PDFUploadButton', '<PDFUpload' | Set-Content temp_file.txt"
copy temp_file.txt src\components\layout\MainContent.tsx
del temp_file.txt

echo File moves and renames completed!
echo.
echo Next steps:
echo 1. Verify that imports have been updated correctly in MainContent.tsx
echo 2. Check if any other files import PDFListStyled or PDFUploadButton and update those imports
echo 3. Once everything is working, you can delete the original files:
echo    - src\components\PDFListStyled.tsx
echo    - src\components\PDFUploadButton.tsx
echo.
echo The original files have been backed up to the backup-components directory.
echo.
echo Done!