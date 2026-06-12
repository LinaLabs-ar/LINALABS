@echo off
REM ============================================
REM  LinaLabs Auto-Deploy to GitHub + Netlify
REM  Just run this file, no manual steps needed
REM ============================================

setlocal enabledelayexpansion

REM Set variables
set REPO_DIR=D:\Users\Razor\Documents\Razor\Clientes\LINALABS\SISTEMA
set TOKEN=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
set GITHUB_REPO=https://Razormab:%TOKEN%@github.com/LinaLabs-ar/LINALABS.git

REM Check if git is available
where git >nul 2>nul
if errorlevel 1 (
    echo ❌ Git not found. Please install Git first.
    pause
    exit /b 1
)

cd /d %REPO_DIR%

REM Show current status
echo.
echo 🔄 Checking for changes...
git status --short

REM Check if there are changes
git diff-index --quiet HEAD --
if errorlevel 1 (
    echo.
    echo 📝 Changes detected. Creating commit...

    REM Stage all web changes
    git add web/ .github/

    REM Create commit with timestamp
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
    for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)

    git commit -m "Auto-deploy update !mydate! !mytime!

Automatic deployment via GitHub Actions.
Site will be updated at https://linalabs.ar

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

    if errorlevel 1 (
        echo ❌ Commit failed
        pause
        exit /b 1
    )

    echo ✅ Commit created
) else (
    echo ✅ No changes detected
    echo.
    pause
    exit /b 0
)

REM Push to GitHub
echo.
echo 📤 Pushing to GitHub...
git push %GITHUB_REPO% master

if errorlevel 1 (
    echo ❌ Push failed
    pause
    exit /b 1
)

echo.
echo ✅ Push successful!
echo.
echo 🚀 GitHub Actions is now deploying...
echo.
echo 📊 Check status:
echo    https://github.com/LinaLabs-ar/LINALABS/actions
echo.
echo 🌐 Site:
echo    https://linalabs.ar
echo.
echo ✨ All done! Changes will be live in ~1-2 minutes.
echo.
pause
