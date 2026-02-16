# CredX Credit Repair Platform

A full-stack credit repair management system built for The Malloy Group Financial LLC (DBA: CredX).

## Features

- **Landing Page** with lead capture form
- **Lead Management** - Track leads from initial contact to conversion
- **Client Portal** - View credit reports and dispute status
- **Automated Dispute Workflows** - Multi-round letter generation
- **Billing & Subscriptions** - Stripe integration with retry logic
- **Compliance** - NY DFS registered, audit logging, 3-day cancellation

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL 15
- **Payments**: Stripe
- **E-Signatures**: DocuSign API (future)
- **Credit Data**: Credit Score API (future)

## Quick Start (One Command)

```bash
cd ~/.openclaw/workspace/credx
./start-dev.sh
```

This will:
1. Start PostgreSQL in Docker
2. Run database migrations
3. Start the backend (http://localhost:3001)
4. Start the frontend (http://localhost:5173)

Then open http://localhost:5173 in your browser.

### Other Commands

```bash
./status.sh    # Check if services are running
./stop-dev.sh  # Stop all services
```

## Manual Setup

If you prefer to start services separately:

### 1. Start the Database

```bash
cd ~/.openclaw/workspace/credx
docker-compose up -d
```

### 2. Set up the Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

Backend: http://localhost:3001

### 3. Set up the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Project Structure

```
credx/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.tsx
│   └── package.json
├── backend/            # Express + Prisma backend
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── docker-compose.yml  # PostgreSQL container
├── start-dev.sh        # Quick start script
├── stop-dev.sh         # Stop all services
├── status.sh           # Check service status
└── README.md
```

## API Endpoints

### Leads
- `POST /api/leads` - Create a new lead
- `GET /api/leads` - Get all leads

### Health
- `GET /health` - Health check

## Compliance Notes

- All PII (SSN, DOB) must be encrypted at rest
- 3-day cancellation right must be disclosed
- No credit repair work before payment
- Audit logs track all data access
- Rate limiting on all endpoints

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/credx?schema=public"
PORT=3001
JWT_SECRET="your-secret-key"
STRIPE_SECRET_KEY="sk_test_..."
SENDGRID_API_KEY="SG."
```

## Next Steps

1. [ ] Set up authentication (JWT + bcrypt)
2. [ ] Create staff/admin dashboard
3. [ ] Integrate Stripe for billing
4. [ ] Build credit report integration
5. [ ] Implement dispute letter generation
6. [ ] Add DocuSign for contracts
7. [ ] Set up email automation with SendGrid

## License

Private - The Malloy Group Financial LLC
