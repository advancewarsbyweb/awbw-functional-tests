#!/bin/bash

# Create the personal-automation-account.json file from scratch

cat > cypress/fixtures/personal-automation-account.json <<'EOF'
{
  "StandardAccount": "YourThrowawayAccountHere",
  "StandardAccountPass": "YourPasswordHere"
}
EOF

echo "Created cypress/fixtures/personal-automati/on-account.json"
