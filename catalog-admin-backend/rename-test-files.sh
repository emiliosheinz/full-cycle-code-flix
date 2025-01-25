#!/bin/bash

# Find and rename all files containing .test. in their names
find . -type f -name "*.test.*" | while read -r file; do
  new_name="${file//.test./.spec.}"
  mv "$file" "$new_name"
  echo "Renamed: $file -> $new_name"
done

echo "All files containing '.test.' have been renamed to '.spec.'."

