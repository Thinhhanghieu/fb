@echo off
set CLOUDFLARED="C:\Program Files (x86)\cloudflared\cloudflared.exe"

echo [1/3] Khoi dong Backend Tunnel...
start /b "" %CLOUDFLARED% tunnel --url http://localhost:8080 > backend_tunnel.log 2>&1

echo Dang doi Backend cap link...
:wait_backend
timeout /t 2 > nul
findstr /C:"https://" backend_tunnel.log > nul
if errorlevel 1 goto wait_backend

for /f "tokens=4" %%a in ('findstr /C:"https://" backend_tunnel.log') do set BACKEND_URL=%%a
echo [+] Backend Link: %BACKEND_URL%

echo [2/3] Cap nhat Frontend Environment...
echo NEXT_PUBLIC_API_URL=%BACKEND_URL%/api > frontend\.env.local
docker-compose restart frontend

echo [3/3] Khoi dong Frontend Tunnel...
start /b "" %CLOUDFLARED% tunnel --url http://localhost:3000 > frontend_tunnel.log 2>&1

echo Dang doi Frontend cap link...
:wait_frontend
timeout /t 2 > nul
findstr /C:"https://" frontend_tunnel.log > nul
if errorlevel 1 goto wait_frontend

for /f "tokens=4" %%a in ('findstr /C:"https://" frontend_tunnel.log') do set FRONTEND_URL=%%a
echo.
echo ========================================================
echo CHUC MUNG! UNG DUNG CUA BAN DA ONLINE:
echo.
echo Frontend (Giao dien): %FRONTEND_URL%
echo Backend (API):        %BACKEND_URL%
echo.
echo Luu y: Dung tat cua so nay de duy tri link.
echo ========================================================
pause
