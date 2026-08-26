# 스킬 실체는 .claude\skills 에 있고 저장소에 포함되어 있다.
# Claude Code 는 추가 설정 없이 바로 읽는다.
#
# 이 스크립트는 Cursor·Antigravity 처럼 .agents\skills 를 읽는 도구를 위해
# 링크를 만든다. Claude Code 만 쓴다면 실행하지 않아도 된다.
# Junction 을 쓰므로 관리자 권한이나 개발자 모드가 없어도 동작한다.
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $root ".claude\skills"
$dst  = Join-Path $root ".agents\skills"

if (-not (Test-Path $src)) { throw "실패: $src 가 없다." }

if (Test-Path $dst) { (Get-Item $dst -Force).Delete() }
New-Item -ItemType Junction -Path $dst -Target $src | Out-Null

Write-Output "완료: .agents\skills -> .claude\skills"
Get-ChildItem $dst | Select-Object -ExpandProperty Name
