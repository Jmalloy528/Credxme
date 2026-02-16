#!/bin/bash

# CredX Status Check Script

CREDX_DIR="$HOME/.openclaw/workspace/credx"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📊 CredX Status Check"
echo "====================="
echo ""

# Check PostgreSQL
echo -n "🗄️  PostgreSQL: "
if docker ps | grep -q "credx-postgres"; then
    echo -e "${GREEN}Running${NC}"
else
    echo -e "${RED}Stopped${NC}"
fi

# Check Backend
echo -n "⚙️  Backend API: "
if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    echo -e "${GREEN}Running${NC} (http://localhost:3001)"
else
    echo -e "${RED}Stopped${NC}"
fi

# Check Frontend (check if port 5173 is listening)
echo -n "🎨 Frontend: "
if ss -tlnp | grep -q ":5173"; then
    echo -e "${GREEN}Running${NC} (http://localhost:5173)"
else
    echo -e "${RED}Stopped${NC}"
fi

echo ""
echo "Commands:"
echo "  Start:  ./start-dev.sh"
echo "  Stop:   ./stop-dev.sh"
echo "  Status: ./status.sh"
