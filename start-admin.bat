@echo off
title Portfolio Admin Server

echo Stopping any existing server on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| find "3000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo Starting Portfolio CMS Server...
echo =======================================================
echo SERVER IS RUNNING! KEEP THIS WINDOW OPEN.
echo.
echo Admin Panel: http://localhost:3000/admin.html
echo Main Site:   http://localhost:3000/
echo.
echo Press Ctrl+C or simply close this window to stop the server.
echo =======================================================

:: Wait a moment to ensure the port is freed
timeout /t 2 /nobreak >nul

:: Open the browser
start http://localhost:3000/admin.html

:: Start the node server
node server.js

pause
