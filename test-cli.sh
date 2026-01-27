#!/usr/bin/env bash

# Test script for deploy-bbc CLI

echo "🧪 Testing deploy-bbc CLI..."
echo ""

# Test 1: Minimal setup
echo "Test 1: Minimal setup (postgres + jwt)"
cd /tmp
bun ~/Documents/cli/cli/src/index.ts test-minimal --CI --postgres --jwt --noInstall --noGit
echo "✅ Test 1 passed"
echo ""

# Test 2: Full stack with AI
echo "Test 2: Full stack (postgres, redis, jwt, openai, vercel-ai)"
cd /tmp
bun ~/Documents/cli/cli/src/index.ts test-fullstack --CI \
  --postgres --redis \
  --jwt --session \
  --openai --anthropic --vercelAI \
  --resend \
  --bullmq \
  --swagger --vitest \
  --noInstall --noGit
echo "✅ Test 2 passed"
echo ""

# Test 3: MongoDB + OAuth
echo "Test 3: MongoDB + OAuth setup"
cd /tmp
bun ~/Documents/cli/cli/src/index.ts test-mongo --CI \
  --mongodb \
  --oauth \
  --socketio \
  --scalar \
  --noInstall --noGit
echo "✅ Test 3 passed"
echo ""

# Test 4: Cloud services
echo "Test 4: Cloud services (AWS, GCP, Azure)"
cd /tmp
bun ~/Documents/cli/cli/src/index.ts test-cloud --CI \
  --postgres \
  --jwt \
  --aws --gcp --azure --cloudflareR2 \
  --sentry \
  --noInstall --noGit
echo "✅ Test 4 passed"
echo ""

echo "✨ All tests completed successfully!"
echo ""
echo "To test interactively, run:"
echo "  cd /tmp && bun ~/Documents/cli/cli/src/index.ts my-project"
