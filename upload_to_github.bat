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

<<<<<<< HEAD
REM Check if git repository already exists
if exist .git (
    echo Git repository already exists, skipping initialization.
) else (
    echo Initializing Git repository...
    git init
)
=======
echo Initializing Git repository...
git init
>>>>>>> 47ffd58bce77d1cb9ec9534739b5d1244d3688d8

echo Adding files to Git...
git add .

<<<<<<< HEAD
echo.
echo Please enter your commit message:
echo (Press Enter for default: "Update: PDF Classroom Manager")
set /p COMMIT_MESSAGE=
if "%COMMIT_MESSAGE%"=="" set COMMIT_MESSAGE=Update: PDF Classroom Manager

echo Creating commit with message: "%COMMIT_MESSAGE%"
git commit -m "%COMMIT_MESSAGE%"
=======
echo Creating initial commit...
git commit -m "Initial commit: PDF Classroom Manager with database and batch operations"
>>>>>>> 47ffd58bce77d1cb9ec9534739b5d1244d3688d8

echo.
echo Please enter your GitHub username:
set /p GITHUB_USERNAME=

echo.
echo Please enter your repository name (e.g., pdf-classroom-manager):
set /p REPO_NAME=

<<<<<<< HEAD
REM Check if remote already exists
git remote -v | findstr "origin" > nul
if %ERRORLEVEL% EQU 0 (
    echo Remote 'origin' already exists. Updating URL...
    git remote set-url origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
) else (
    echo Adding remote repository...
    git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
)

echo.
echo Choose branch to push to:
echo 1. main (recommended for new repositories)
echo 2. master (older standard)
echo 3. Custom branch name
set /p BRANCH_CHOICE=

if "%BRANCH_CHOICE%"=="1" (
    set BRANCH_NAME=main
) else if "%BRANCH_CHOICE%"=="2" (
    set BRANCH_NAME=master
) else if "%BRANCH_CHOICE%"=="3" (
    echo Enter custom branch name:
    set /p BRANCH_NAME=
) else (
    set BRANCH_NAME=main
)

echo.
echo Pushing to GitHub branch: %BRANCH_NAME%...
echo.
echo If the push fails, you may need to:
echo 1. Create the repository on GitHub first
echo 2. Pull before pushing if the repository already has content
echo 3. Use -f flag to force push (caution: this overwrites remote changes)
echo.

REM Try pushing normally first
git push -u origin %BRANCH_NAME%

REM If normal push fails, offer options
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Push failed. Would you like to:
    echo 1. Try to pull first, then push
    echo 2. Force push (WARNING: This will overwrite any remote changes)
    echo 3. Exit without pushing
    set /p PUSH_OPTION=
    
    if "%PUSH_OPTION%"=="1" (
        echo Pulling from remote repository...
        git pull origin %BRANCH_NAME%
        echo Pushing again...
        git push -u origin %BRANCH_NAME%
    ) else if "%PUSH_OPTION%"=="2" (
        echo Force pushing to remote repository...
        git push -f -u origin %BRANCH_NAME%
    ) else (
        echo Exiting without pushing. You can push manually later.
    )
=======
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
>>>>>>> 47ffd58bce77d1cb9ec9534739b5d1244d3688d8
)

echo.
echo Done! Check your repository at: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.
pause