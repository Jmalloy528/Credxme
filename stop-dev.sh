#!/bin/bash

# CredX Stop Script

CREDX_DIR="$HOME/.openclaw/workspace/credx"
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping CredX services...${NC}"
echo ""

# Stop any Node processes for CredX
echo "Stopping Node.js processes..."
pkill -f "credx/frontend" 2>/dev/null || true
pkill -f "credx/backend" 2>/dev/null || true

# Stop Docker containers
echo "Stopping Docker containers..."
cd "$CREDX_DIR" 2>/dev/null && docker compose down 2>/dev/null || true

echo ""
echo -e "${GREEN}✓ All CredX services stopped${NC}"
