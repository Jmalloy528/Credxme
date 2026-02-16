#!/bin/bash

# CredX Full Deployment Script
# Uses Vercel and Railway tokens for automated deployment

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Tokens
VERCEL_TOKEN="vcp_7g4SM09k3PCZOoZXhdJBcBmNnb6JQyeijtUE7te8Z0IrSnjvBB32RRtC"
RAILWAY_TOKEN="f7222418-2096-4fb8-b810-755fb035018c"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 CredX Full Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}Error: Must run from credx root directory${NC}"
    exit 1
fi

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Install Railway CLI if not present
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Installing Railway CLI...${NC}"
    npm install -g @railway/cli
fi

echo -e "${YELLOW}Step 1: Building Frontend...${NC}"
cd frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build production version
echo "Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend built${NC}"
cd ..

echo ""
echo -e "${YELLOW}Step 2: Deploying Frontend to Vercel...${NC}"

# Deploy to Vercel using token
cd frontend

# Check if already linked to Vercel project
if [ ! -d ".vercel" ]; then
    echo "Creating new Vercel project..."
    vercel --token="$VERCEL_TOKEN" --confirm --name="credx-website"
fi

# Deploy to production
echo "Deploying to production..."
DEPLOY_OUTPUT=$(vercel --token="$VERCEL_TOKEN" --prod 2>&1)
echo "$DEPLOY_OUTPUT"

# Extract deployment URL
VERCEL_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^[:space:]]*' | head -1)

echo -e "${GREEN}✓ Frontend deployed${NC}"
echo -e "${BLUE}URL: $VERCEL_URL${NC}"
cd ..

echo ""
echo -e "${YELLOW}Step 3: Deploying Backend to Railway...${NC}"
cd backend

# Login to Railway with token
export RAILWAY_TOKEN="$RAILWAY_TOKEN"

# Check if already initialized
if [ ! -d ".railway" ]; then
    echo "Initializing Railway project..."
    railway init --name="credx-api" --environment="production"
fi

# Add PostgreSQL if not exists
echo "Setting up PostgreSQL database..."
railway add --database=postgresql

# Deploy backend
echo "Deploying backend..."
railway up

# Get backend URL
RAILWAY_URL=$(railway domain 2>/dev/null || echo "https://credx-api.up.railway.app")

echo -e "${GREEN}✓ Backend deployed${NC}"
echo -e "${BLUE}URL: $RAILWAY_URL${NC}"
cd ..

echo ""
echo -e "${YELLOW}Step 4: Updating Configuration...${NC}"

# Update frontend API URL
if [ -n "$RAILWAY_URL" ]; then
    echo "VITE_API_URL=$RAILWAY_URL" > frontend/.env.production
    echo -e "${GREEN}✓ Updated API URL${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Frontend: $VERCEL_URL"
echo "Backend: $RAILWAY_URL"
echo ""
echo "Next steps:"
echo "1. Add custom domain in Vercel dashboard"
echo "2. Update DNS: A record → 76.76.21.21"
echo "3. Wait for SSL certificate"
echo "4. Test lead form submission"
echo ""
echo -e "${BLUE}Manage at:${NC}"
echo "Vercel: https://vercel.com/dashboard"
echo "Railway: https://railway.app/dashboard"
