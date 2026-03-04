#!/bin/bash
# Deploy script for Apple Calculator

echo "📦 Publishing to GitHub..."

# Initialize git if needed
if [ ! -d .git ]; then
  git init
fi

git add .
git commit -m "Apple-style calculator web app" 2>/dev/null || git commit -m "Apple-style calculator web app" --allow-empty

# Create GitHub repo (requires gh CLI: brew install gh)
if command -v gh &> /dev/null; then
  gh repo create calculator-app --public --source=. --remote=origin --push
  echo "✅ Pushed to GitHub!"
else
  echo "⚠️  Install GitHub CLI (brew install gh) to auto-publish."
  echo "   Or create a repo at github.com/new and run:"
  echo "   git remote add origin https://github.com/YOUR_USERNAME/calculator-app.git"
  echo "   git push -u origin main"
fi

echo ""
echo "🚀 Deploying to Vercel..."

if command -v vercel &> /dev/null; then
  vercel --prod
else
  npx vercel --prod
fi

echo ""
echo "✨ Done! Your calculator should be live."
