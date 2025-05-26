#!/bin/zsh

# Keep these posts published
KEEP_POST1="a-complete-devops-automation-project-with-python-azure-and-kubernetes.md"
KEEP_POST2="a-guide-to-automating-cost-savings-on-azure-with-python-terraform-and-azure-devops.md"

# Process all .md files in the blog directory and its subdirectories
find ./src/data/blog -name "*.md" | while read -r file; do
  filename=$(basename "$file")
  
  # Skip the posts we want to keep published
  if [[ "$filename" == "$KEEP_POST1" || "$filename" == "$KEEP_POST2" ]]; then
    echo "Keeping published: $filename"
    
    # Ensure draft is set to false or not present
    if grep -q "^draft: " "$file"; then
      sed -i '' 's/^draft: .*/draft: false/' "$file"
      echo "  - Set draft: false"
    fi
  else
    echo "Setting as draft: $filename"
    
    # Check if there's already a draft field in the frontmatter
    if grep -q "^draft: " "$file"; then
      sed -i '' 's/^draft: .*/draft: true/' "$file"
    else
      # Add draft: true after the frontmatter opening
      sed -i '' '1,/---/{/---/a\
draft: true
}' "$file"
    fi
  fi
done

echo "Done updating draft status for all posts."
