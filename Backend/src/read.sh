#!/usr/bin/env bash
#
# recursivelist.sh
#
# Usage:
#   ./recursivelist.sh [DIRECTORY] [OUTPUT_FILE]
#
#   DIRECTORY    Root directory to scan (defaults to current dir)
#   OUTPUT_FILE  Path to the output .txt (defaults to listing.txt)
#

# Set defaults
ROOT_DIR="${1:-.}"
OUTPUT_FILE="${2:-listing.txt}"
OUTPUT_BASENAME="$(basename "$OUTPUT_FILE")"

# Create or truncate the output file
: > "$OUTPUT_FILE"

# Traverse, excluding the output file itself to avoid infinite loops
find "$ROOT_DIR" \
  -name "$OUTPUT_BASENAME" -prune \
  -o \( -type d -o -type f \) -print | sort |
while IFS= read -r ENTRY; do
  echo "=== Path: $ENTRY ===" >> "$OUTPUT_FILE"

  if [ -d "$ENTRY" ]; then
    echo "Directory contents:" >> "$OUTPUT_FILE"
    ls -1A "$ENTRY" >> "$OUTPUT_FILE" 2>/dev/null \
      || echo "(unable to list directory)" >> "$OUTPUT_FILE"

  elif [ -f "$ENTRY" ]; then
    echo "File contents:" >> "$OUTPUT_FILE"
    echo "----- BEGIN $ENTRY -----" >> "$OUTPUT_FILE"

    if file "$ENTRY" | grep -qE 'text|ASCII|UTF-8'; then
      cat "$ENTRY" >> "$OUTPUT_FILE"
    else
      echo "(binary or non-text file, skipped)" >> "$OUTPUT_FILE"
    fi

    echo "------ END $ENTRY ------" >> "$OUTPUT_FILE"
  fi

  echo >> "$OUTPUT_FILE"
done

echo "Listing complete: $OUTPUT_FILE"
