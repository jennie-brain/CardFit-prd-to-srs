#!/usr/bin/env bash
# 스킬 실체는 .claude/skills 에 있고 저장소에 포함되어 있다.
# Claude Code 는 추가 설정 없이 바로 읽는다.
#
# 이 스크립트는 Cursor·Antigravity 처럼 .agents/skills 를 읽는 도구를 위해
# 링크를 만든다. Claude Code 만 쓴다면 실행하지 않아도 된다.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/.claude/skills"
DST="$ROOT/.agents/skills"

[ -d "$SRC" ] || { echo "실패: $SRC 가 없다."; exit 1; }

if [ -e "$DST" ] || [ -L "$DST" ]; then rm -rf "$DST"; fi
ln -s "../.claude/skills" "$DST"

echo "완료: .agents/skills -> .claude/skills"
ls "$DST"
