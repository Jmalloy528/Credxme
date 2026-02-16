#!/bin/bash

# CredX Website Deployment Script

echo "🚀 Starting CredX Website Deployment..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}Error: Must run from credx root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Building Frontend...${NC}"
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Build for production
echo "Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend built successfully${NC}"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${YELLOW}Step 2: Deploying to Vercel...${NC}"
echo "If this is your first time, you'll need to:"
echo "1. Log in to Vercel"
echo "2. Link this project"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}🎉 Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Add your domain in Vercel dashboard"
    echo "2. Update DNS settings at your registrar"
    echo "3. Wait for SSL certificate to issue"
    echo "4. Test all forms and links"
    echo ""
    echo "Need help? Check DEPLOYMENT_GUIDE.md"
else
    echo -e "${RED}Deployment failed. Check errors above.${NC}"
    exit 1
fi
