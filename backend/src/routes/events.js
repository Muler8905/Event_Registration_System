const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all events (public)
router.get('/', [
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'asc' },
        include: {
          creator: {
            select: { id: true, name: true }
          },
          _count: {
            select: { registrations: true }
          }
        }
      }),
      prisma.event.count({ where })
    ]);

    res.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single event (public)
router.get('/:id', async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        creator: {
          select: { id: true, name: true }
        },
        _count: {
          select: { registrations: true }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Create event (Admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('imageUrl').optional().isURL().withMessage('Valid image URL required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, location, date, capacity, imageUrl } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        capacity,
        imageUrl,
        createdBy: req.user.id
      },
      include: {
        creator: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    next(error);
  }
});

// Update event (Admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date required'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('imageUrl').optional().isURL().withMessage('Valid image URL required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, location, date, capacity, imageUrl } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (date) updateData.date = new Date(date);
    if (capacity) updateData.capacity = capacity;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        creator: {
          select: { id: true, name: true }
        }
      }
    });

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    next(error);
  }
});

// Delete event (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    await prisma.event.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;