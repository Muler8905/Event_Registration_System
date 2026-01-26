const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedClients = new Map();
    this.analyticsInterval = null;
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      socket.on('join-admin', (adminData) => {
        if (adminData.role === 'ADMIN') {
          socket.join('admin-room');
          this.connectedClients.set(socket.id, { ...adminData, joinedAt: new Date() });
          console.log(`Admin joined: ${adminData.email}`);
          
          // Send initial analytics data
          this.sendAnalyticsUpdate(socket);
        }
      });

      socket.on('request-analytics', () => {
        this.sendAnalyticsUpdate(socket);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });
    });

    // Start real-time analytics broadcasting
    this.startAnalyticsBroadcast();
  }

  async sendAnalyticsUpdate(socket = null) {
    try {
      const analytics = await this.generateRealTimeAnalytics();
      
      if (socket) {
        socket.emit('analytics-update', analytics);
      } else {
        this.io.to('admin-room').emit('analytics-update', analytics);
      }
    } catch (error) {
      console.error('Error sending analytics update:', error);
    }
  }

  async generateRealTimeAnalytics() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalEvents,
      totalUsers,
      totalRegistrations,
      todayRegistrations,
      weeklyRegistrations,
      monthlyRevenue,
      activeEvents,
      recentActivity
    ] = await Promise.all([
      prisma.event.count(),
      prisma.user.count(),
      prisma.registration.count(),
      prisma.registration.count({ where: { registeredAt: { gte: todayStart } } }),
      prisma.registration.count({ where: { registeredAt: { gte: weekStart } } }),
      this.calculateRevenue(monthStart),
      this.getActiveEvents(),
      this.getRecentActivity()
    ]);

    return {
      timestamp: now,
      metrics: {
        totalEvents,
        totalUsers,
        totalRegistrations,
        todayRegistrations,
        weeklyRegistrations,
        monthlyRevenue,
        activeEvents: activeEvents.length,
        conversionRate: this.calculateConversionRate(),
        averageEventCapacity: await this.getAverageCapacity()
      },
      charts: {
        registrationTrends: await this.getRegistrationTrends(),
        eventStatusDistribution: await this.getEventStatusDistribution(),
        userGrowth: await this.getUserGrowthData(),
        revenueBreakdown: await this.getRevenueBreakdown()
      },
      recentActivity,
      popularEvents: await this.getPopularEvents(),
      systemHealth: this.getSystemHealth()
    };
  }

  async calculateRevenue(startDate) {
    // Mock calculation - in real app, this would calculate based on paid events
    const registrations = await prisma.registration.count({
      where: { registeredAt: { gte: startDate } }
    });
    return registrations * 25; // $25 per registration
  }

  async getActiveEvents() {
    return await prisma.event.findMany({
      where: { 
        date: { gte: new Date() },
        registrations: { some: {} }
      },
      include: { _count: { select: { registrations: true } } }
    });
  }

  async getRecentActivity() {
    const recentRegistrations = await prisma.registration.findMany({
      take: 5,
      orderBy: { registeredAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { title: true } }
      }
    });

    const recentEvents = await prisma.event.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { title: true, createdAt: true }
    });

    const activities = [
      ...recentRegistrations.map(reg => ({
        type: 'registration',
        message: `${reg.user.name} registered for ${reg.event.title}`,
        time: reg.registeredAt,
        badge: { type: 'success', text: 'New Registration' }
      })),
      ...recentEvents.map(event => ({
        type: 'event',
        message: `New event created: ${event.title}`,
        time: event.createdAt,
        badge: { type: 'primary', text: 'Event Created' }
      }))
    ];

    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);
  }

  calculateConversionRate() {
    // Mock conversion rate calculation
    return (Math.random() * 15 + 5).toFixed(2);
  }

  async getAverageCapacity() {
    const events = await prisma.event.findMany({ select: { capacity: true } });
    if (events.length === 0) return 0;
    return Math.round(events.reduce((sum, e) => sum + e.capacity, 0) / events.length);
  }

  async getRegistrationTrends() {
    const trends = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const count = await prisma.registration.count({
        where: {
          registeredAt: { gte: dayStart, lt: dayEnd }
        }
      });

      trends.push({
        date: date.toISOString().split('T')[0],
        registrations: count,
        revenue: count * 25
      });
    }
    return trends;
  }

  async getEventStatusDistribution() {
    const events = await prisma.event.findMany({
      where: { date: { gte: new Date() } },
      include: { _count: { select: { registrations: true } } }
    });

    const distribution = { available: 0, fillingFast: 0, almostFull: 0, soldOut: 0 };
    
    events.forEach(event => {
      const rate = (event._count.registrations / event.capacity) * 100;
      if (rate >= 100) distribution.soldOut++;
      else if (rate >= 80) distribution.almostFull++;
      else if (rate >= 50) distribution.fillingFast++;
      else distribution.available++;
    });

    return distribution;
  }

  async getUserGrowthData() {
    const growth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const count = await prisma.user.count({
        where: {
          createdAt: { gte: monthStart, lte: monthEnd }
        }
      });

      growth.push({
        month: monthStart.toISOString().slice(0, 7),
        users: count
      });
    }
    return growth;
  }

  async getRevenueBreakdown() {
    // Mock revenue breakdown by event category
    return {
      technology: Math.floor(Math.random() * 10000) + 5000,
      business: Math.floor(Math.random() * 8000) + 4000,
      design: Math.floor(Math.random() * 6000) + 3000,
      marketing: Math.floor(Math.random() * 7000) + 3500,
      other: Math.floor(Math.random() * 4000) + 2000
    };
  }

  async getPopularEvents() {
    return await prisma.event.findMany({
      take: 10,
      include: {
        _count: { select: { registrations: true } },
        creator: { select: { name: true } }
      },
      orderBy: { registrations: { _count: 'desc' } }
    });
  }

  getSystemHealth() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return {
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      },
      status: 'healthy',
      connectedClients: this.connectedClients.size,
      lastUpdate: new Date()
    };
  }

  startAnalyticsBroadcast() {
    // Broadcast analytics every 30 seconds
    this.analyticsInterval = setInterval(() => {
      this.sendAnalyticsUpdate();
    }, 30000);
  }

  // Event handlers for real-time updates
  onNewRegistration(registrationData) {
    this.io.to('admin-room').emit('new-registration', {
      type: 'registration',
      data: registrationData,
      timestamp: new Date()
    });
    
    // Trigger analytics update
    setTimeout(() => this.sendAnalyticsUpdate(), 1000);
  }

  onNewEvent(eventData) {
    this.io.to('admin-room').emit('new-event', {
      type: 'event',
      data: eventData,
      timestamp: new Date()
    });
    
    // Trigger analytics update
    setTimeout(() => this.sendAnalyticsUpdate(), 1000);
  }

  onEventUpdate(eventData) {
    this.io.to('admin-room').emit('event-updated', {
      type: 'event-update',
      data: eventData,
      timestamp: new Date()
    });
  }

  shutdown() {
    if (this.analyticsInterval) {
      clearInterval(this.analyticsInterval);
    }
    if (this.io) {
      this.io.close();
    }
  }
}

module.exports = new WebSocketService();