# Magic Maven Fixer for Windows 🪄🛡️✨
Write-Host "Searching for Maven on your machine... (Please wait) 🔎" -ForegroundColor Cyan

# Common search paths
$searchPaths = @("C:\", "D:\", "$env:USERPROFILE\Downloads")
$foundPath = $null

foreach ($p in $searchPaths) {
    if (Test-Path $p) {
        $foundPath = Get-ChildItem -Path $p -Filter "mvn.cmd" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
        if ($foundPath) { break }
    }
}

if ($foundPath) {
    Write-Host "FOUND MAVEN! 🛡️✨ PATH: $foundPath" -ForegroundColor Green
    
    # Update the run_erp.bat with the actual path
    $batFile = "run_erp.bat"
    $content = Get-Content $batFile
    $newContent = $content -replace 'SET MAVEN_BIN=".*"', "SET MAVEN_BIN=""$foundPath"""
    $newContent | Set-Content $batFile
    
    Write-Host "Updated run_erp.bat with the correct path! You can now run it. 🚀" -ForegroundColor Green
} else {
    Write-Host "COULD NOT FIND MAVEN. 🛑 Please ensure you have downloaded and unzipped it." -ForegroundColor Red
}

pause
