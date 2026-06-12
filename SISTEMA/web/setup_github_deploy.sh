#!/bin/bash

# Setup GitHub webhook for Netlify continuous deployment
SITE_ID="f7f238cd-2cea-40fb-89bf-4c876f7cf6a7"
GITHUB_REPO="Razor-eng/LINALABS"
TOKEN="$NETLIFY_AUTH_TOKEN"

# Step 1: Enable continuous deployment for the repository
echo "🔗 Enabling continuous deployment..."

curl -X POST "https://api.netlify.com/api/v1/sites/${SITE_ID}/source" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"provider\": \"github\",
    \"repo\": \"${GITHUB_REPO}\",
    \"branch\": \"main\",
    \"private\": false
  }" 2>/dev/null | jq '.' || echo "API call attempt made"

echo ""
echo "✅ Repository configuration request sent"
echo "If successful, GitHub Auto-Deploy is now enabled"

