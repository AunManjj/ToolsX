#!/bin/bash

# ToolsX Build Script for Netlify - 3D Enhanced Version
# This script prepares your 3D website for deployment

echo "🎨 ToolsX 3D Website Build Process"
echo "═════════════════════════════════════"

# Check for admin password environment variable
if [ -z "$ADMIN_PASS" ]; then
  echo "⚠️  Warning: ADMIN_PASS environment variable not set"
  echo "Please add ADMIN_PASS to your Netlify environment variables"
fi

echo "📦 Optimizing assets..."

# Create output directory if it doesn't exist
mkdir -p dist

# Copy main files
echo "📝 Copying main files..."
cp index.html dist/
cp LOGO_AND_FAVICON_OPTIONS.html dist/
cp build.sh dist/

echo "✨ Creating favicon files..."

# Create favicon directory
mkdir -p dist/favicons

# Note: In production, you would generate PNG favicons here
# For now, we'll include inline SVG favicons in the HTML

echo "🔐 Preparing admin section..."

# If admin.html exists, prepare it
if [ -f "admin.html" ]; then
  if [ -n "$ADMIN_PASS" ]; then
    sed -i "s/__ADMIN_PASS__/$ADMIN_PASS/g" admin.html
    cp admin.html dist/
    echo "✅ Admin panel configured"
  fi
fi

echo "🚀 Build Complete!"
echo "═════════════════════════════════════"
echo "✨ Your 3D website is ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Choose your preferred logo option"
echo "2. Choose your preferred favicon style"
echo "3. Deploy to production"
echo ""
echo "View logo options at: /LOGO_AND_FAVICON_OPTIONS.html"
