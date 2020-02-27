#!/bin/bash
set -euo pipefail

if [[ "${1:-}" = --help ]]; then
  cat <<EOF
Generate release notes.

If a tag is given, release notes are generated for that version.

If no tag is given, release notes are generated for the next version that will
be released, by comparing what is on master with the latest tag.

Usage:
  $0 [tag]

Arguments:
  tag  The version to generate release notes for (default: what's unreleased)
EOF

  exit
fi

git fetch --quiet origin

head="${1:-origin/master}"
tag_prefix=R

last_tag=$(
  git describe \
    --abbrev=0 \
    --match="${tag_prefix}*" \
    --tags \
    "${head}^"
)

last_version="${last_tag#$tag_prefix}"
current_tag="${1:-${tag_prefix}$((last_version + 1))}"

git log \
  --first-parent \
  --format="- %b _%s" \
  --merges \
  --reverse \
  "${last_tag}..${head}" |
  sed -E 's/_Merge pull request (#[0-9]+) from.+$/(\1)/'

printf "\nhttps://github.com/pataruco/martin-blanco/compare/%s...%s\n" $last_tag $current_tag
