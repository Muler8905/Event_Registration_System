const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard statistics (Admin only)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Get current stats
    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      upcomingEvents,
      lastMonthUsers,
      lastMonthEvents,
      lastMonthRegistrations
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.registration.count(),
      prisma.event.count({
        where: {
          date: {
            gte: now
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonth
          }
        }
      }),
      prisma.event.count({
        where: {
          createdAt: {
            gte: lastMonth
          }
        }
      }),
      prisma.registration.count({
        where: {
          registeredAt: {
            gte: lastMonth
          }
        }
      })
    ]);

    // Get popular events
    const popularEvents = await prisma.event.findMany({
      include: {
        _count: {
          select: { registrations: true }
        },
        creator: {
          select: { name: true }
        }
      },
      orderBy: {
        registrations: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // Get recent registrations
    const recentRegistrations = await prisma.registration.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        },
        event: {
          select: { title: true, date: true }
        }
      },
      orderBy: {
        registeredAt: 'desc'
      },
      take: 10
    });

    // Calculate growth percentages
    const userGrowth = lastMonthUsers > 0 ? ((lastMonthUsers / (totalUsers - lastMonthUsers)) * 100).toFixed(1) : 0;
    const eventGrowth = lastMonthEvents > 0 ? ((lastMonthEvents / (totalEvents - lastMonthEvents)) * 100).toFixed(1) : 0;
    const registrationGrowth = lastMonthRegistrations > 0 ? ((lastMonthRegistrations / (totalRegistrations - lastMonthRegistrations)) * 100).toFixed(1) : 0;

    res.json({
      overview: {
        totalUsers: {
          value: totalUsers,
          growth: userGrowth,
          trend: userGrowth > 0 ? 'up' : 'down'
        },
        totalEvents: {
          value: totalEvents,
          growth: eventGrowth,
          trend: eventGrowth > 0 ? 'up' : 'down'
        },
        totalRegistrations: {
          value: totalRegistrations,
          growth: registrationGrowth,
          trend: registrationGrowth > 0 ? 'up' : 'down'
        },
        upcomingEvents: {
          value: upcomingEvents,
          growth: 0,
          trend: 'neutral'
        }
      },
      popularEvents,
      recentRegistrations
    });
  } catch (error) {
    next(error);
  }
});

// Get user statistics
router.get('/user', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      totalRegistrations,
      upcomingEvents,
      pastEvents,
      cancelledRegistrations
    ] = await Promise.all([
      prisma.registration.count({
        where: { userId }
      }),
      prisma.registration.count({
        where: {
          userId,
          event: {
            date: {
              gte: new Date()
            }
          }
        }
      }),
      prisma.registration.count({
        where: {
          userId,
          event: {
            date: {
              lt: new Date()
            }
          }
        }
      }),
      prisma.registration.count({
        where: {
          userId,
          status: 'CANCELLED'
        }
      })
    ]);

    res.json({
      totalRegistrations,
      upcomingEvents,
      pastEvents,
      cancelledRegistrations
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;