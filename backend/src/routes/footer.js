const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const footerService = require('../services/footerService');

const router = express.Router();

// Get public footer data
router.get('/public', async (req, res, next) => {
  try {
    const { page = 'home' } = req.query;
    
    const footerData = await footerService.getFooterData('USER', 'public', page);
    
    res.json({
      success: true,
      data: footerData
    });
  } catch (error) {
    next(error);
  }
});

// Get admin footer data (requires authentication)
router.get('/admin', authenticateToken, async (req, res, next) => {
  try {
    const { page = 'dashboard' } = req.query;
    const userRole = req.user.role || 'USER';
    
    if (userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    const footerData = await footerService.getFooterData(userRole, 'admin', page);
    
    res.json({
      success: true,
      data: footerData
    });
  } catch (error) {
    next(error);
  }
});

// Get footer statistics only
router.get('/stats', async (req, res, next) => {
  try {
    const { context = 'public' } = req.query;
    
    let stats;
    if (context === 'admin' && req.user && req.user.role === 'ADMIN') {
      stats = await footerService.getAdminFooterStats();
    } else {
      stats = await footerService.getPublicFooterStats();
    }
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// Get contextual navigation
router.get('/navigation/:page', async (req, res, next) => {
  try {
    const { page } = req.params;
    const userRole = req.user?.role || 'USER';
    
    const navigation = footerService.getContextualNavigation(page, userRole);
    
    res.json({
      success: true,
      data: navigation
    });
  } catch (error) {
    next(error);
  }
});

// Get social media links with stats
router.get('/social', async (req, res, next) => {
  try {
    const socialLinks = await footerService.getSocialLinks();
    
    res.json({
      success: true,
      data: socialLinks
    });
  } catch (error) {
    next(error);
  }
});

// Get system announcements
router.get('/announcements', async (req, res, next) => {
  try {
    const announcements = await footerService.getSystemAnnouncements();
    
    res.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    next(error);
  }
});

// Newsletter subscription endpoint
router.post('/newsletter/subscribe', async (req, res, next) => {
  try {
    const { email, preferences = [] } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Valid email address is required'
      });
    }
    
    // In a real application, you would:
    // 1. Validate the email
    // 2. Check if already subscribed
    // 3. Add to your email service provider (Mailchimp, SendGrid, etc.)
    // 4. Send confirmation email
    
    // Mock implementation
    console.log(`Newsletter subscription: ${email}`, preferences);
    
    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        email,
        subscribed: true,
        confirmationSent: true
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get newsletter statistics (admin only)
router.get('/newsletter/stats', authenticateToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    const stats = await footerService.getNewsletterStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// Clear footer cache (admin only, useful for development)
router.post('/cache/clear', authenticateToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    footerService.clearCache();
    
    res.json({
      success: true,
      message: 'Footer cache cleared successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get system health (admin only)
router.get('/health', authenticateToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    const health = footerService.getSystemHealth();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;