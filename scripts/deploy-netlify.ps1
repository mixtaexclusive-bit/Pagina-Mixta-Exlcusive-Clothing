$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$envFile = Join-Path (Get-Location) ".env.local"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
      $name = $matches[1].Trim()
      $value = $matches[2].Trim().Trim('"')
      Set-Item -Path "env:$name" -Value $value
    }
  }
}

if (-not $env:NETLIFY_AUTH_TOKEN) {
  Write-Host "Falta NETLIFY_AUTH_TOKEN en .env.local" -ForegroundColor Red
  Write-Host 'Agrega esta linea con tu token de Netlify:'
  Write-Host 'NETLIFY_AUTH_TOKEN="nfp_..."'
  exit 1
}

$siteId = "ab09cae5-702a-4ca7-b87b-13a7f169aabd"
Write-Host "Desplegando a Netlify (sitio $siteId)..." -ForegroundColor Cyan
npx netlify deploy --prod --build --site=$siteId
