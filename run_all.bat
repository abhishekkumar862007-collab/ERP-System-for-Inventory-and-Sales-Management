@echo off
echo ====================================================
echo   ERP SYSTEM - STARTING BACKEND AND FRONTEND
echo ====================================================
echo.
echo [1/2] Launching Spring Boot Backend on Port 7070...
start "ERP Backend (Port 7070)" cmd /k "cd backend && mvn spring-boot:run"

echo [2/2] Launching React Vite Frontend on Port 3000...
start "ERP Frontend (Port 3000)" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo ====================================================
echo SUCCESS!
echo - Frontend: http://localhost:3000
echo - Swagger Docs: http://localhost:7070/swagger-ui.html
echo - H2 DB Console: http://localhost:7070/h2-console
echo.
echo Login Credentials:
echo - Admin: admin / admin123
echo ====================================================
pause
