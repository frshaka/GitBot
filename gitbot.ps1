$dest = "$env:USERPROFILE\bin"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item ".\dist\gitbot-win-x64.exe" "$dest\gitbot.exe" -Force
$path = [Environment]::GetEnvironmentVariable("Path", "User")
if (-not $path.Split(";") -contains $dest) {
  [Environment]::SetEnvironmentVariable("Path", "$path;$dest", "User")
}
# abra um novo terminal
gitbot -help
