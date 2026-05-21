@echo off
cd /d "%~dp0"
start "EXCLUSIVE CLOTHING - servidor" cmd /k ""C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" dev --hostname 127.0.0.1 --port 3000"
timeout /t 5 /nobreak > nul
start "" "http://127.0.0.1:3000"
