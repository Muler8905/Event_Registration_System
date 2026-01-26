const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class FooterService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }

  // Get cached data or fetch fresh data
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFunction();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  // Get footer statistics for public pages
  async getPublicFooterStats() {
    return await this.getCachedData('publicStats', async () => {
      const [totalEvents, totalUsers, todayRegistrations, upcomingEvents] = await Promise.all([
        prisma.event.count(),
        prisma.user.count(),
        prisma.registration.count({
          where: {
            registeredAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        prisma.event.count({
          where: {
            date: { gte: new Date() }
          }
        })
      ]);

      return {
        totalEvents,
        totalUsers,
        todayRegistrations,
        upcomingEvents,
        onlineUsers: this.getOnlineUsersCount(),
        lastUpdated: new Date()
      };
    });
  }

  // Get footer statistics for admin pages
  async getAdminFooterStats() {
    return await this.getCachedData('adminStats', async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now - 7 * 24 * 60 * 60 * 1000);

      const [
        totalEvents,
        totalUsers,
        totalRegistrations,
        todayRegistrations,
        weeklyRegistrations,
        pendingApprovals,
        systemHealth
      ] = await Promise.all([
        prisma.event.count(),
        prisma.user.count(),
        prisma.registration.count(),
        prisma.registration.count({
          where: { registeredAt: { gte: todayStart } }
        }),
        prisma.registration.count({
          where: { registeredAt: { gte: weekStart } }
        }),
        prisma.event.count({
          where: { 
            // Assuming events need approval - adjust based on your schema
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          }
        }),
        this.getSystemHealth()
      ]);

      return {
        totalEvents,
        totalUsers,
        totalRegistrations,
        todayRegistrations,
        weeklyRegistrations,
        pendingApprovals,
        onlineUsers: this.getOnlineUsersCount(),
        systemHealth,
        lastUpdated: new Date()
      };
    });
  }

  // Get system health information
  getSystemHealth() {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    return {
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
      },
      cpu: {
        usage: this.getCPUUsage()
      },
      status: 'healthy',
      version: '2.1.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  // Mock CPU usage - in production, you'd use a proper monitoring library
  getCPUUsage() {
    return Math.floor(Math.random() * 30) + 10; // 10-40% usage
  }

  // Get online users count (mock implementation)
  getOnlineUsersCount() {
    // In a real application, this would track active sessions
    // For now, return a random number between 5-50
    return Math.floor(Math.random() * 45) + 5;
  }

  // Get contextual navigation based on current page
  getContextualNavigation(page, userRole = 'USER') {
    const navigation = {
      public: {
        home: [
          { label: 'Browse Events', href: '/events', icon: 'Calendar' },
          { label: 'Register', href: '/register', icon: 'UserPlus' },
          { label: 'Learn More', href: '/about', icon: 'Info' }
        ],
        events: [
          { label: 'Create Event', href: '/events/create', icon: 'Plus', adminOnly: true },
          { label: 'My Events', href: '/profile/events', icon: 'User' },
          { label: 'Search Events', href: '/events/search', icon: 'Search' }
        ],
        profile: [
          { label: 'Edit Profile', href: '/profile/edit', icon: 'Edit' },
          { label: 'My Registrations', href: '/profile/registrations', icon: 'FileText' },
          { label: 'Settings', href: '/profile/settings', icon: 'Settings' }
        ]
      },
      admin: {
        dashboard: [
          { label: 'Quick Stats', action: 'showStats', icon: 'BarChart3' },
          { label: 'Recent Activity', action: 'showActivity', icon: 'Activity' },
          { label: 'System Health', action: 'showHealth', icon: 'Monitor' }
        ],
        events: [
          { label: 'Create Event', action: 'createEvent', icon: 'Plus' },
          { label: 'Bulk Actions', action: 'bulkActions', icon: 'Layers' },
          { label: 'Export Data', action: 'exportData', icon: 'Download' }
        ],
        users: [
          { label: 'Add User', action: 'addUser', icon: 'UserPlus' },
          { label: 'Bulk Import', action: 'bulkImport', icon: 'Upload' },
          { label: 'User Analytics', action: 'userAnalytics', icon: 'TrendingUp' }
        ]
      }
    };

    const pageNav = userRole === 'ADMIN' ? navigation.admin[page] : navigation.public[page];
    return pageNav ? pageNav.filter(item => !item.adminOnly || userRole === 'ADMIN') : [];
  }

  // Get footer links based on user role and context
  getFooterLinks(userRole = 'USER', context = 'public') {
    const baseLinks = {
      company: [
        { label: 'About Us', href: '/about', icon: 'Info' },
        { label: 'Careers', href: '/careers', icon: 'Briefcase' },
        { label: 'Press', href: '/press', icon: 'Newspaper' },
        { label: 'Contact', href: '/contact', icon: 'Mail' }
      ],
      support: [
        { label: 'Help Center', href: '/help', icon: 'HelpCircle' },
        { label: 'Community', href: '/community', icon: 'Users' },
        { label: 'Status', href: '/status', icon: 'Activity' },
        { label: 'Feedback', href: '/feedback', icon: 'MessageSquare' }
      ],
      legal: [
        { label: 'Privacy Policy', href: '/privacy', icon: 'Shield' },
        { label: 'Terms of Service', href: '/terms', icon: 'FileText' },
        { label: 'Cookie Policy', href: '/cookies', icon: 'Cookie' },
        { label: 'GDPR', href: '/gdpr', icon: 'Lock' }
      ],
      resources: [
        { label: 'API Docs', href: '/api-docs', icon: 'Code' },
        { label: 'Guides', href: '/guides', icon: 'Book' },
        { label: 'Blog', href: '/blog', icon: 'PenTool' },
        { label: 'Changelog', href: '/changelog', icon: 'GitBranch' }
      ]
    };

    if (userRole === 'ADMIN' && context === 'admin') {
      baseLinks.admin = [
        { label: 'Admin Guide', href: '/admin/guide', icon: 'BookOpen' },
        { label: 'System Logs', href: '/admin/logs', icon: 'FileText' },
        { label: 'Backup', href: '/admin/backup', icon: 'Download' },
        { label: 'Security', href: '/admin/security', icon: 'Shield' }
      ];
    }

    return baseLinks;
  }

  // Get social media links with engagement stats
  async getSocialLinks() {
    return await this.getCachedData('socialLinks', async () => {
      return [
        {
          platform: 'Twitter',
          href: 'https://twitter.com/eventhub',
          icon: 'Twitter',
          followers: '12.5K',
          color: 'hover:text-blue-400'
        },
        {
          platform: 'LinkedIn',
          href: 'https://linkedin.com/company/eventhub',
          icon: 'Linkedin',
          followers: '8.2K',
          color: 'hover:text-blue-600'
        },
        {
          platform: 'GitHub',
          href: 'https://github.com/eventhub',
          icon: 'Github',
          stars: '2.1K',
          color: 'hover:text-gray-900'
        },
        {
          platform: 'Discord',
          href: 'https://discord.gg/eventhub',
          icon: 'MessageCircle',
          members: '5.8K',
          color: 'hover:text-indigo-500'
        }
      ];
    });
  }

  // Get newsletter subscription stats
  async getNewsletterStats() {
    return await this.getCachedData('newsletterStats', async () => {
      // In a real app, this would come from your email service provider
      return {
        totalSubscribers: 15420,
        thisMonthSignups: 342,
        openRate: 24.5,
        clickRate: 3.2
      };
    });
  }

  // Get system announcements for footer
  async getSystemAnnouncements() {
    return await this.getCachedData('announcements', async () => {
      return [
        {
          type: 'maintenance',
          message: 'Scheduled maintenance on Sunday 2AM-4AM EST',
          priority: 'medium',
          showUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
          type: 'feature',
          message: 'New analytics dashboard now available!',
          priority: 'low',
          showUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      ].filter(announcement => new Date() < announcement.showUntil);
    });
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache() {
    this.cache.clear();
  }

  // Get comprehensive footer data
  async getFooterData(userRole = 'USER', context = 'public', page = 'home') {
    const [
      stats,
      links,
      socialLinks,
      contextualNav,
      announcements,
      newsletterStats
    ] = await Promise.all([
      context === 'admin' ? this.getAdminFooterStats() : this.getPublicFooterStats(),
      this.getFooterLinks(userRole, context),
      this.getSocialLinks(),
      this.getContextualNavigation(page, userRole),
      this.getSystemAnnouncements(),
      this.getNewsletterStats()
    ]);

    return {
      stats,
      links,
      socialLinks,
      contextualNavigation: contextualNav,
      announcements,
      newsletterStats,
      systemHealth: context === 'admin' ? this.getSystemHealth() : null,
      timestamp: new Date()
    };
  }
}

module.exports = new FooterService();