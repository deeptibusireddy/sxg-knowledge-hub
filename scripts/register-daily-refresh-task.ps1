param(
  [string]$TaskName = "SxG Dashboard Daily Refresh",
  [string]$StartTime = "07:00"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$runner = Join-Path $PSScriptRoot "run_daily_refresh.ps1"

if (-not (Test-Path $runner)) {
  throw "Runner script not found: $runner"
}

$action = New-ScheduledTaskAction -Execute "pwsh.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$runner`""
$trigger = New-ScheduledTaskTrigger -Daily -At $StartTime
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description "Daily refresh for SxG dashboard data folder" -Force

Write-Host "Scheduled task registered: $TaskName at $StartTime"
Write-Host "Working folder should remain: $repoRoot"
