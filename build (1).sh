#!/bin/bash

# ToolsX Build Script for Netlify
# This script replaces the __ADMIN_PASS__ placeholder with the actual password
# from the ADMIN_PASS environment variable

if [ -z "$ADMIN_PASS" ]; then
  echo "⚠️  Warning: ADMIN_PASS environment variable not set"
  echo "Please add ADMIN_PASS to your Netlify environment variables"
  exit 1
fi

echo "🔐 Replacing admin password placeholder..."

# Replace __ADMIN_PASS__ with the actual password in admin.html
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/__ADMIN_PASS__/$ADMIN_PASS/g" admin.html
else
  # Linux
  sed -i "s/__ADMIN_PASS__/$ADMIN_PASS/g" admin.html
fi

echo "✅ Build complete!"
echo "🚀 Site is ready to deploy"
