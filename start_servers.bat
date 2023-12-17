@echo off
SETLOCAL

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Beginning installation...
    echo Downloading Node.js...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile 'node-installer.msi'"
    echo Running Node.js installer...
    start /wait node-installer.msi
    echo Node.js installation initiated. Please follow the installer instructions.
    echo Once installation is complete, you may need to restart this script.
) else (
    echo Node.js is already installed.
)

REM Check if .NET SDK is installed
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo .NET SDK not found. Beginning installation...
    echo Downloading .NET SDK...
    powershell -Command "Invoke-WebRequest -Uri 'https://download.visualstudio.microsoft.com/download/pr/93961dfb-d1e0-49c8-9230-abcba1ebab5a/811ed1eb63d7652325727720edda26a8/dotnet-sdk-8.0.100-win-x64.exe' -OutFile 'dotnet-sdk-installer.exe'"
    echo Running .NET SDK installer...
    start /wait dotnet-sdk-installer.exe
    echo .NET SDK installation initiated. Please follow the installer instructions.
    echo Once installation is complete, you may need to restart this script.
) else (
    echo .NET SDK is already installed.
)

REM Change to your project directory
cd C:\Users\USER\Desktop\passwordManager\usbRemotePass\usbRemotePass

REM Run the ASP.NET Core project
echo Starting ASP.NET Core server...
start "" "http://localhost:5000/index.html"
dotnet run

:end
pause
ENDLOCAL
