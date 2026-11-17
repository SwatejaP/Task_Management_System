@echo off
title TaskPulse Demo Launcher
echo ==============================================
echo    Starting TaskPulse MERN Application
echo ==============================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"

echo Starting Backend Server on port 5000...
start "MERN Backend (API)" cmd /k "cd /d ""%~dp0server"" && npm run dev"

ping 127.0.0.1 -n 3 >nul

echo Starting Frontend Server on port 5173...
start "MERN Frontend (React)" cmd /k "cd /d ""%~dp0client"" && npm run dev"

ping 127.0.0.1 -n 3 >nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo.
echo Application started successfully!
echo.
echo ==============================================
echo    Demo Login Credentials:
echo    Email:    alice@gmail.com
echo    Password: Abc@123
echo ==============================================
echo.
