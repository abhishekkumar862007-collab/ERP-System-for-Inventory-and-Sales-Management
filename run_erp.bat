@echo off
echo Starting ERP System...
cd backend

:: ----------------------------------------------------
:: CHANGE THIS PATH TO YOUR MAVEN bin FOLDER!
SET MAVEN_BIN="C:\maven\apache-maven-3.9.x\bin\mvn"
:: ----------------------------------------------------

%MAVEN_BIN% clean spring-boot:run
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ----------------------------------------------------
    echo [ERROR] Maven not found at %MAVEN_BIN%
    echo ----------------------------------------------------
    pause
)
pause
