#!/bin/bash

# Create the personal-automation-account.json file from scratch

mkdir -p tests/fixtures

cat > tests/fixtures/personal-automation-account.json <<'EOF'
{
  "StandardAccount": "YourThrowawayAccountHere",
  "StandardAccountPass": "YourPasswordHere"
}
EOF

echo "Created tests/fixtures/personal-automation-account.json"
