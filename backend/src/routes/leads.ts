import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// POST /api/leads - Create a new lead
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, creditGoal } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        error: 'Missing required fields: firstName, lastName, email, phone'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Check if lead already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'A lead with this email already exists'
      });
    }

    // Create user and client (lead)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: '', // Will be set when they create an account
        firstName,
        lastName,
        phone,
        role: 'CLIENT',
        clientProfile: {
          create: {
            status: 'LEAD',
            serviceTier: 'ESSENTIAL',
            creditGoal
          }
        }
      },
      include: {
        clientProfile: true
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LEAD_CREATED',
        entity: 'Client',
        entityId: user.clientProfile?.id,
        details: { source: 'landing_page', creditGoal }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.clientProfile?.status
      }
    });

  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /api/leads - Get all leads (staff/admin only)
router.get('/', async (req, res) => {
  try {
    const leads = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        clientProfile: {
          status: 'LEAD'
        }
      },
      include: {
        clientProfile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: leads.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        creditGoal: user.clientProfile?.creditGoal,
        createdAt: user.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
