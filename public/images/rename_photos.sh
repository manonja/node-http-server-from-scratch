#!/usr/bin/env bash

# This script renames files matching DSC*-Enhanced-NR.jpg to photo-#.jpg

# Initialize a counter
count=1

# Loop through all matching files in the current directory
for file in DSC*-Enhanced-NR.jpg; do
    # Check if the file actually exists to avoid errors if none match
    if [ -f "$file" ]; then
        new_filename="photo-${count}.jpg"
        echo "Renaming '$file' to '$new_filename'..."
        mv "$file" "$new_filename"
        count=$((count + 1))
    fi
done

echo "All files have been renamed successfully!"
