#!/bin/bash

# CredX Quick Start Script
# This script starts the entire CredX development environment

set -e

CREDX_DIR="$HOME/.openclaw/workspace/credx"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 CredX Development Server Starter${NC}"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -d "$CREDX_DIR" ]; then
    echo -e "${RED}Error: CredX directory not found at $CREDX_DIR${NC}"
    exit 1
fi

cd "$CREDX_DIR"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    docker-compose down 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Step 1: Start PostgreSQL
echo -e "${BLUE}📦 Step 1: Starting PostgreSQL...${NC}"
if ! docker-compose ps | grep -q "credx-postgres"; then
    docker-compose up -d
    echo -e "${GREEN}✓ PostgreSQL started${NC}"
    echo "   Waiting for database to be ready..."
    sleep 3
else
    echo -e "${GREEN}✓ PostgreSQL already running${NC}"
fi

# Step 2: Database migrations
echo ""
echo -e "${BLUE}🗄️  Step 2: Running database migrations...${NC}"
cd "$CREDX_DIR/backend"

# Check if migrations need to run
if ! npx prisma migrate status 2>/dev/null | grep -q "Database schema is up to date"; then
    npx prisma migrate dev --name init || npx prisma migrate deploy
    echo -e "${GREEN}✓ Database migrations complete${NC}"
else
    echo -e "${GREEN}✓ Database already up to date${NC}"
fi

# Step 3: Start Backend
echo ""
echo -e "${BLUE}⚙️  Step 3: Starting Backend Server...${NC}"
echo "   (This will run in the background)"
cd "$CREDX_DIR/backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing backend dependencies...${NC}"
    npm install
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "   API: http://localhost:3001"
echo "   Health: http://localhost:3001/health"

# Wait a moment for backend to start
sleep 2

# Step 4: Start Frontend
echo ""
echo -e "${BLUE}🎨 Step 4: Starting Frontend Dev Server...${NC}"
cd "$CREDX_DIR/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing frontend dependencies...${NC}"
    npm install
fi

echo ""
echo -e "${GREEN}====================================${NC}"
echo -e "${GREEN}🎉 CredX is starting up!${NC}"
echo -e "${GREEN}====================================${NC}"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "⚙️  Backend:  http://localhost:3001"
echo "🗄️  Database: postgresql://localhost:5432/credx"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Start frontend (this will block)
npm run dev

# If frontend exits, cleanup
kill $BACKEND_PID 2>/dev/null || true
cleanup
