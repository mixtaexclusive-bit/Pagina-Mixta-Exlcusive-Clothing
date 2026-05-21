@echo off
cd /d "%~dp0"
echo === EXCLUSIVE CLOTHING DIAGNOSTICO === > startup-debug.log
echo Fecha: %date% %time% >> startup-debug.log
echo Carpeta: %cd% >> startup-debug.log
echo. >> startup-debug.log
echo Node: >> startup-debug.log
"C:\Program Files\nodejs\node.exe" --version >> startup-debug.log 2>&1
echo. >> startup-debug.log
echo Next existe: >> startup-debug.log
if exist "node_modules\next\dist\bin\next" (
  echo SI >> startup-debug.log
) else (
  echo NO >> startup-debug.log
)
echo. >> startup-debug.log
echo Iniciando Next... >> startup-debug.log
"C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" dev --hostname 127.0.0.1 --port 3000 >> startup-debug.log 2>&1
echo. >> startup-debug.log
echo Next se detuvo con codigo %errorlevel% >> startup-debug.log
