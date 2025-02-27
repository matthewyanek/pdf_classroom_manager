@echo off
echo PDF Classroom Manager - GitHub Upload Script
echo ===============================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/downloads
    pause
    exit /b 1
)

echo Creating .gitignore file...
echo # Python > .gitignore
echo __pycache__/ >> .gitignore
echo *.py[cod] >> .gitignore
echo *$py.class >> .gitignore
echo *.so >> .gitignore
echo .env >> .gitignore
echo venv/ >> .gitignore
echo ENV/ >> .gitignore
echo. >> .gitignore
echo # Node.js >> .gitignore
echo node_modules/ >> .gitignore
echo .next/ >> .gitignore
echo out/ >> .gitignore
echo .DS_Store >> .gitignore
echo *.log >> .gitignore
echo .vercel >> .gitignore
echo .env.local >> .gitignore
echo. >> .gitignore
echo # Project specific >> .gitignore
echo storage/ >> .gitignore
echo pdf_manager.db >> .gitignore

echo Initializing Git repository...
git init

echo Adding files to Git...
git add .

echo Creating initial commit...
git commit -m "Initial commit: PDF Classroom Manager with database and batch operations"

echo.
echo Please enter your GitHub username:
set /p GITHUB_USERNAME=matthewyanek

echo.
echo Please enter your repository name (e.g., pdf-classroom-manager):
set /p REPO_NAME=pdf-classroom-manager

echo.
echo Adding remote repository...
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

echo Pushing to GitHub...
git push -u origin master

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Note: If you're seeing authentication errors, you might need to:
    echo 1. Use a personal access token instead of your password
    echo 2. Configure Git to use the GitHub CLI or credential manager
    echo.
    echo For more information, visit: https://docs.github.com/en/authentication
)

echo.
echo Done! Check your repository at: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.
pause