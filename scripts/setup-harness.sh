#!/usr/bin/env bash
# Claude Code가 .agents/skills를 읽지 못하므로 .claude/skills 링크를 만든다.
# git은 이 링크를 전달하지 않는다. clone 후 한 번 실행한다.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/.agents/skills"
DST="$ROOT/.claude/skills"

[ -d "$SRC" ] || { echo "실패: $SRC 가 없다."; exit 1; }

mkdir -p "$ROOT/.claude"
[ -e "$DST" ] || [ -L "$DST" ] && rm -rf "$DST" || true
ln -s "../.agents/skills" "$DST"

echo "완료: .claude/skills -> .agents/skills"
ls "$DST"
