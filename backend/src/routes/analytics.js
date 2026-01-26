const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get real-time dashboard analytics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get basic counts
    const [
      totalEvents,
      totalUsers,
      totalRegistrations,
      upcomingEvents,
      todayRegistrations,
      thisWeekEvents,
      thisMonthUsers,
      lastMonthUsers,
      thisMonthRegistrations,
      lastMonthRegistrations
    ] = await Promise.all([
      prisma.event.count(),
      prisma.user.count(),
      prisma.registration.count(),
      prisma.event.count({
        where: { date: { gte: now } }
      }),
      prisma.registration.count({
        where: { registeredAt: { gte: todayStart } }
      }),
      prisma.event.count({
        where: { 
          date: { 
            gte: weekStart,
            lte: now 
          } 
        }
      }),
      prisma.user.count({
        where: { createdAt: { gte: monthStart } }
      }),
      prisma.user.count({
        where: { 
          createdAt: { 
            gte: lastMonthStart,
            lte: lastMonthEnd 
          } 
        }
      }),
      prisma.registration.count({
        where: { registeredAt: { gte: monthStart } }
      }),
      prisma.registration.count({
        where: { 
          registeredAt: { 
            gte: lastMonthStart,
            lte: lastMonthEnd 
          } 
        }
      })
    ]);

    // Get popular events
    const popularEvents = await prisma.event.findMany({
      include: {
        _count: { select: { registrations: true } },
        creator: { select: { name: true } }
      },
      orderBy: {
        registrations: { _count: 'desc' }
      },
      take: 5
    });

    // Get recent activity (mock data for now)
    const recentActivity = [
      {
        type: 'registration',
        message: 'New registration for Tech Innovation Summit',
        time: new Date(now - 5 * 60000),
        badge: { type: 'success', text: 'New' }
      },
      {
        type: 'event',
        message: 'Event created: AI Workshop 2024',
        time: new Date(now - 15 * 60000),
        badge: { type: 'primary', text: 'Created' }
      },
      {
        type: 'user',
        message: 'New user registered: john.doe@example.com',
        time: new Date(now - 25 * 60000),
        badge: { type: 'success', text: 'Joined' }
      },
      {
        type: 'cancellation',
        message: 'Registration cancelled for Design Meetup',
        time: new Date(now - 35 * 60000),
        badge: { type: 'warning', text: 'Cancelled' }
      },
      {
        type: 'edit',
        message: 'Event updated: Marketing Conference 2024',
        time: new Date(now - 45 * 60000),
        badge: { type: 'primary', text: 'Updated' }
      }
    ];

    // Generate registration trends (last 7 days)
    const registrationTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayRegistrations = await prisma.registration.count({
        where: {
          registeredAt: {
            gte: dayStart,
            lt: dayEnd
          }
        }
      });

      registrationTrends.push({
        date: date.toISOString().split('T')[0],
        registrations: dayRegistrations,
        events: Math.floor(Math.random() * 3) + 1 // Mock events count
      });
    }

    // Calculate event status distribution
    const events = await prisma.event.findMany({
      where: { date: { gte: now } },
      include: { _count: { select: { registrations: true } } }
    });

    const eventStatusDistribution = {
      available: 0,
      fillingFast: 0,
      almostFull: 0,
      soldOut: 0
    };

    events.forEach(event => {
      const rate = (event._count.registrations / event.capacity) * 100;
      if (rate >= 100) eventStatusDistribution.soldOut++;
      else if (rate >= 80) eventStatusDistribution.almostFull++;
      else if (rate >= 50) eventStatusDistribution.fillingFast++;
      else eventStatusDistribution.available++;
    });

    // Calculate growth percentages
    const userGrowthPercentage = lastMonthUsers > 0 
      ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100).toFixed(1)
      : 0;

    const registrationGrowthPercentage = lastMonthRegistrations > 0
      ? ((thisMonthRegistrations - lastMonthRegistrations) / lastMonthRegistrations * 100).toFixed(1)
      : 0;

    // Mock revenue data
    const revenue = {
      total: Math.floor(Math.random() * 50000) + 25000,
      thisMonth: thisMonthRegistrations * 25, // $25 per registration
      projectedMonth: Math.floor(Math.random() * 10000) + 5000
    };

    res.json({
      totalEvents,
      totalUsers,
      totalRegistrations,
      upcomingEvents,
      todayRegistrations,
      thisWeekEvents,
      averageCapacity: events.length > 0 
        ? Math.round(events.reduce((sum, e) => sum + e.capacity, 0) / events.length)
        : 0,
      popularEvents,
      recentActivity,
      registrationTrends,
      eventStatusDistribution,
      userGrowth: {
        thisMonth: thisMonthUsers,
        lastMonth: lastMonthUsers,
        percentage: userGrowthPercentage
      },
      registrationGrowth: {
        thisMonth: thisMonthRegistrations,
        lastMonth: lastMonthRegistrations,
        percentage: registrationGrowthPercentage
      },
      revenue,
      lastUpdated: now
    });
  } catch (error) {
    next(error);
  }
});

// Get event analytics
router.get('/events/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: {
              select: { name: true, email: true, createdAt: true }
            }
          },
          orderBy: { registeredAt: 'desc' }
        },
        _count: { select: { registrations: true } }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Calculate registration timeline
    const registrationTimeline = {};
    event.registrations.forEach(reg => {
      const date = reg.registeredAt.toISOString().split('T')[0];
      registrationTimeline[date] = (registrationTimeline[date] || 0) + 1;
    });

    // Calculate user demographics (mock data)
    const demographics = {
      newUsers: event.registrations.filter(reg => 
        new Date() - new Date(reg.user.createdAt) < 30 * 24 * 60 * 60 * 1000
      ).length,
      returningUsers: event.registrations.length - event.registrations.filter(reg => 
        new Date() - new Date(reg.user.createdAt) < 30 * 24 * 60 * 60 * 1000
      ).length
    };

    res.json({
      event: {
        ...event,
        registrations: undefined // Remove detailed registrations from response
      },
      registrationTimeline,
      demographics,
      totalRegistrations: event._count.registrations,
      capacityUtilization: (event._count.registrations / event.capacity * 100).toFixed(1)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;