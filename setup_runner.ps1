# Setup Maven Wrapper for Java Framework 🪄🛡️✨
Write-Host "Setting up the Maven Wrapper... 🔎" -ForegroundColor Cyan

# Go to backend
cd backend

# Create the wrapper if Maven is found in common locations
$mvnPath = Get-Command mvn -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $mvnPath) {
    # Search for it
    $mvnPath = Get-ChildItem -Path C:\,D:\ -Filter "mvn.cmd" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
}

if ($mvnPath) {
    Write-Host "FOUND MAVEN! Generating local wrapper... 🛡️" -ForegroundColor Green
    & $mvnPath -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true wrapper:wrapper
    Write-Host "SUCCESS! You can now run the backend using: .\mvnw spring-boot:run" -ForegroundColor Yellow
} else {
    Write-Host "COULD NOT FIND MAVEN. Please ensure you have it unzipped on C: or D:." -ForegroundColor Red
}

pause
