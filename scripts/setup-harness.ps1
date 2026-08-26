# Claude Code가 .agents/skills를 읽지 못하므로 .claude/skills 링크를 만든다.
# git은 이 링크를 전달하지 않는다. clone 후 한 번 실행한다.
# Junction을 쓰므로 관리자 권한이나 개발자 모드가 없어도 동작한다.
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $root ".agents\skills"
$dst  = Join-Path $root ".claude\skills"

if (-not (Test-Path $src)) { throw "실패: $src 가 없다." }

New-Item -ItemType Directory -Path (Join-Path $root ".claude") -Force | Out-Null
if (Test-Path $dst) { (Get-Item $dst -Force).Delete() }
New-Item -ItemType Junction -Path $dst -Target $src | Out-Null

Write-Output "완료: .claude\skills -> .agents\skills"
Get-ChildItem $dst | Select-Object -ExpandProperty Name
