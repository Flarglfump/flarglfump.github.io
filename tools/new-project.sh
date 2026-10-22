#!/bin/sh
# Make the folder for a new project:  tools/new-project.sh my-game [path/to/web/index.html]
# Then add an entry with slug "my-game" to projects.js.
set -e
slug="$1"
[ -n "$slug" ] || { echo "usage: $0 <slug> [web build index.html]"; exit 1; }
case "$slug" in *[!a-z0-9-]*) echo "use lowercase letters, digits and dashes"; exit 1;; esac
root="$(cd "$(dirname "$0")/.." && pwd)"
dir="$root/projects/$slug"
[ -e "$dir" ] && { echo "projects/$slug already exists"; exit 1; }
mkdir -p "$dir"
sed "s/SLUG/$slug/g" "$root/projects/_template/index.html" > "$dir/index.html"
if [ -n "$2" ]; then mkdir -p "$dir/play"; cp "$2" "$dir/play/index.html"; fi
echo "Made projects/$slug/. Now add { slug: \"$slug\", ... } to projects.js."
