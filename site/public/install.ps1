$ErrorActionPreference = "Stop"
$repo = "B-Divyesh/sf-selfhost-upgrade-rehearsal"
$releaseTag = if ($env:REHEARSAL_VERSION) { $env:REHEARSAL_VERSION } else { "latest" }
if ($releaseTag -eq "latest") {
  $base = "https://github.com/$repo/releases/latest/download"
} elseif ($releaseTag -match '^v\d+\.\d+\.\d+$') {
  $base = "https://github.com/$repo/releases/download/$releaseTag"
} else {
  throw "Set REHEARSAL_VERSION to a release tag such as v0.1.3, or leave it unset for latest."
}
$asset = "rehearsal-windows-x86_64.zip"
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("rehearsal-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $tempDir | Out-Null
try {
  Invoke-WebRequest "$base/$asset" -OutFile "$tempDir/$asset"
  Invoke-WebRequest "$base/SHA256SUMS" -OutFile "$tempDir/SHA256SUMS"
  $expected = ((Get-Content "$tempDir/SHA256SUMS") | Where-Object { $_ -match [regex]::Escape($asset) }).Split()[0]
  $actual = (Get-FileHash "$tempDir/$asset" -Algorithm SHA256).Hash.ToLower()
  if ($actual -ne $expected.ToLower()) { throw "SHA256 check failed; the binary was not installed." }
  Expand-Archive "$tempDir/$asset" -DestinationPath $tempDir
  $installDir = if ($env:REHEARSAL_INSTALL_DIR) { $env:REHEARSAL_INSTALL_DIR } else { "$env:LOCALAPPDATA\Rehearsal\bin" }
  New-Item -ItemType Directory -Force -Path $installDir | Out-Null
  Copy-Item "$tempDir/rehearsal.exe" "$installDir/rehearsal.exe" -Force
  Write-Output "Installed rehearsal ($releaseTag) in $installDir and verified its SHA256 checksum."
} finally { Remove-Item -Recurse -Force $tempDir }
