param(
  [string]$PythonExe = "py",
  [switch]$SkipPowerBI,
  [switch]$SkipSql,
  [switch]$SkipAdo,
  [switch]$SkipConvert,
  [switch]$SkipBuild,
  [switch]$SkipDeploy,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

function Invoke-Step {
  param(
    [string]$Name,
    [string]$Command
  )

  Write-Host "==> $Name"
  Write-Host "    $Command"

  if ($DryRun) {
    Write-Host "    [DRY RUN] skipped"
    return 0
  }

  & pwsh -NoProfile -Command $Command
  return $LASTEXITCODE
}

$exitCode = 0

# ── Step 1: Power BI pull ─────────────────────────────────────────────────────
if (-not $SkipPowerBI -and (Test-Path "powerbi_pull_config.json")) {
  $code = Invoke-Step -Name "Power BI pull" -Command "$PythonExe .\daily_powerbi_pull.py --config .\powerbi_pull_config.json"
  if ($code -ne 0) {
    Write-Warning "Power BI pull returned exit code $code"
    $exitCode = $code
  }
} else {
  Write-Host "==> Power BI pull skipped"
}

# ── Step 2: Database pull ─────────────────────────────────────────────────────
if (-not $SkipSql -and (Test-Path "data_pull_config.json")) {
  $code = Invoke-Step -Name "Database pull" -Command "$PythonExe .\dailydatapull.py --config .\data_pull_config.json"
  if ($code -ne 0) {
    Write-Warning "Database pull returned exit code $code"
    if ($exitCode -eq 0) { $exitCode = $code }
  }
} else {
  Write-Host "==> Database pull skipped"
}

# ── Step 3: ADO work item pull ────────────────────────────────────────────────
if (-not $SkipAdo -and (Test-Path "ado_pull_config.json")) {
  $code = Invoke-Step -Name "ADO work item pull" -Command "$PythonExe .\ado_pull.py --config .\ado_pull_config.json"
  if ($code -ne 0) {
    Write-Warning "ADO pull returned exit code $code"
    if ($exitCode -eq 0) { $exitCode = $code }
  }
} else {
  Write-Host "==> ADO pull skipped"
}

# ── Step 4: CSV → JSON conversion ────────────────────────────────────────────
if (-not $SkipConvert) {
  $code = Invoke-Step -Name "CSV → JSON conversion" -Command "$PythonExe .\scripts\convert_csvs_to_json.py --mapping .\scripts\csv_json_mapping.json"
  if ($code -ne 0) {
    Write-Warning "CSV conversion returned exit code $code"
    if ($exitCode -eq 0) { $exitCode = $code }
  }
} else {
  Write-Host "==> CSV → JSON conversion skipped"
}

# ── Step 5: Build ─────────────────────────────────────────────────────────────
if (-not $SkipBuild) {
  $code = Invoke-Step -Name "npm build" -Command "npm run build"
  if ($code -ne 0) {
    Write-Warning "Build failed with exit code $code"
    if ($exitCode -eq 0) { $exitCode = $code }
  }
} else {
  Write-Host "==> Build skipped"
}

# ── Step 6: Deploy to Azure Static Web Apps ───────────────────────────────────
if (-not $SkipDeploy) {
  $swaToken = $env:SWA_DEPLOYMENT_TOKEN
  if (-not $swaToken) {
    Write-Warning "SWA_DEPLOYMENT_TOKEN environment variable is not set — skipping deploy."
    Write-Warning "Set it once: `$env:SWA_DEPLOYMENT_TOKEN = 'your-token'"
  } else {
    $code = Invoke-Step -Name "Deploy to Azure Static Web Apps" -Command "npx --yes @azure/static-web-apps-cli deploy ./dist --deployment-token $swaToken --env production"
    if ($code -ne 0) {
      Write-Warning "Deploy returned exit code $code"
      if ($exitCode -eq 0) { $exitCode = $code }
    }
  }
} else {
  Write-Host "==> Deploy skipped"
}

# ── Summary ───────────────────────────────────────────────────────────────────
if (-not $DryRun) {
  if (Test-Path "data\_powerbi_pull_manifest.json") {
    Write-Host ""
    Write-Host "Power BI manifest: data\_powerbi_pull_manifest.json"
    Get-Content "data\_powerbi_pull_manifest.json"
  }

  if (Test-Path "data\_pull_manifest.json") {
    Write-Host ""
    Write-Host "DB manifest: data\_pull_manifest.json"
    Get-Content "data\_pull_manifest.json"
  }
}

exit $exitCode

