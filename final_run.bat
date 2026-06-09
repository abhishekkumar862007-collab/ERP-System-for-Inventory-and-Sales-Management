@echo off
echo Cleaning up old processes... 🛡️
taskkill /F /IM java.exe /T 2>nul
echo.

echo Searching for Maven... 🔎
for /r C:\ %i in (mvn.cmd) do @if exist "%i" (set MAVEN_BIN="%i" & goto :found)
for /r D:\ %i in (mvn.cmd) do @if exist "%i" (set MAVEN_BIN="%i" & goto :found)

:found
if not defined MAVEN_BIN (
    echo [ERROR] Could not find Maven! Please extract it to C:\maven first. 🛑
    pause
    exit
)

echo FOUND MAVEN! Starting the Java ERP System on Port 7070... 🚀
cd backend
%MAVEN_BIN% clean spring-boot:run
pause
