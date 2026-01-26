const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Register for an event
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ error: 'Cannot register for past events' });
    }

    // Check capacity
    if (event._count.registrations >= event.capacity) {
      return res.status(400).json({ error: 'Event is at full capacity' });
    }

    // Check if already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: eventId
        }
      }
    });

    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        userId: req.user.id,
        eventId: eventId
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Registration successful',
      registration
    });
  } catch (error) {
    next(error);
  }
});

// Get user's registrations
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: { userId: req.user.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            date: true,
            imageUrl: true
          }
        }
      },
      orderBy: { registeredAt: 'desc' }
    });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
});

// Cancel registration
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: req.params.id },
      include: {
        event: {
          select: { date: true }
        }
      }
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Check if user owns this registration
    if (registration.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this registration' });
    }

    // Check if event is in the future
    if (new Date(registration.event.date) < new Date()) {
      return res.status(400).json({ error: 'Cannot cancel registration for past events' });
    }

    await prisma.registration.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;