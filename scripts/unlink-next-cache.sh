#!/usr/bin/env bash
# Production build/start needs a real .next dir so PostCSS can resolve node_modules.
set -euo pipefail

if [ -L .next ]; then
  rm -f .next
fi
