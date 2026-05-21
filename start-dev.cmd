@echo off
title EXCLUSIVE CLOTHING - servidor local
cd /d "%~dp0"
echo Iniciando EXCLUSIVE CLOTHING...
echo.
"C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" dev --hostname 127.0.0.1 --port 3000
echo.
echo El servidor se detuvo. Si ves un error arriba, enviame una captura o copia el texto.
pause
