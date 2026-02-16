import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import leadsRouter from './routes/leads';
import emailsRouter from './routes/emails';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://credxme.com', 'https://www.credxme.com', 'https://credx-website.vercel.app', 'https://credx-website-yc674dht6-jmalloy528s-projects.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/leads', leadsRouter);
app.use('/api/emails', emailsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    name: 'CredX API',
    version: '1.0.0',
    status: 'operational'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CredX API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
