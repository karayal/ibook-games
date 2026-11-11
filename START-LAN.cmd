@echo off
cd /d "%~dp0"
set IBOOK_HOST=0.0.0.0
node server.mjs
if errorlevel 1 pause
