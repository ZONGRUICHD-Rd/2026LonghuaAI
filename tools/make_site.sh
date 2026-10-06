#!/usr/bin/env bash
# 把网页版打包到一个目录（默认 dist/），这个目录的内容就是 GitHub Pages 上的网站。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/dist}"
rm -rf "$OUT"; mkdir -p "$OUT"
cp -r "$ROOT/web/." "$OUT/"
cp -r "$ROOT/素材" "$OUT/素材"
touch "$OUT/.nojekyll"
echo "site -> $OUT"
