Write-Host "Starting Skill & Agent Dashboard..." -ForegroundColor Cyan

$be = Start-Job -ScriptBlock {
  param($root)
  node "$root\backend\src\server.js"
} -ArgumentList $PSScriptRoot

$fe = Start-Job -ScriptBlock {
  param($root)
  Set-Location "$root\frontend"
  npx vite
} -ArgumentList $PSScriptRoot

Start-Sleep -Seconds 2

Write-Host "`n Backend: http://localhost:3001" -ForegroundColor Green
Write-Host " Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "`nPress any key to stop..." -ForegroundColor Yellow

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Stop-Job $be -ErrorAction SilentlyContinue
Stop-Job $fe -ErrorAction SilentlyContinue
Remove-Job $be -ErrorAction SilentlyContinue
Remove-Job $fe -ErrorAction SilentlyContinue

Write-Host "Stopped." -ForegroundColor Cyan
