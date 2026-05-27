$ErrorActionPreference = 'Continue'
Set-Location 'E:\LobeHubWork.worktrees\red\_geming'
$env:Path = "E:\Git\Git\cmd;" + $env:Path
$env:GIT_TERMINAL_PROMPT = "0"
try {
    $output = & git push origin master 2>&1 | Out-String
} catch {
    $output = "EXCEPTION: " + $_.Exception.Message
}
[System.IO.File]::WriteAllText('E:\LobeHubWork.worktrees\red\_geming\push-result.txt', $output, [System.Text.Encoding]::UTF8)
