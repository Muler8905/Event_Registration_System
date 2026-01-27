import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  FileText, 
  Home,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Shield,
  Zap,
  Clock,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  Heart,
  TrendingUp,
  Database,
  Server,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Activity,
  Cpu,
  HardDrive,
  Monitor,
  RefreshCw,
  Download,
  Upload,
  Eye,
  UserCheck,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
  XCircle
} from 'lucide-react'

const DynamicFooter = ({ 
  currentTab, 
  onTabChange, 
  systemStats, 
  connectionStatus,
  footerData,
  loading = false,
  onNewsletterSubscribe
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState('')

  const isAdminPage = location.pathname.startsWith('/admin')
  const isEventPage = location.pathname.startsWith('/events')
  const isProfilePage = location.pathname.startsWith('/profile')

  // Use footer data or system stats
  const stats = footerData?.stats || systemStats || {
    onlineUsers: 0,
    totalEvents: 0,
    todayRegistrations: 0,
    systemLoad: 0
  }

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterEmail || !onNewsletterSubscribe) return

    setNewsletterLoading(true)
    setNewsletterMessage('')

    try {
      await onNewsletterSubscribe(newsletterEmail)
      setNewsletterMessage('Successfully subscribed! Check your email for confirmation.')
      setNewsletterEmail('')
    } catch (error) {
      setNewsletterMessage(error.message || 'Failed to subscribe. Please try again.')
    } finally {
      setNewsletterLoading(false)
    }
  }

  const adminNavigation = [
    { id: 'overview', label: 'Overview', icon: BarChart3, href: '/admin', count: stats.totalEvents },
    { id: 'events', label: 'Events', icon: Calendar, href: '/admin/events', count: stats.totalEvents },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users', count: stats.onlineUsers },
    { id: 'registrations', label: 'Registrations', icon: FileText, href: '/admin/registrations', count: stats.todayRegistrations },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' }
  ]

  const publicNavigation = footerData?.links?.company || [
    { label: 'Home', icon: Home, href: '/', description: 'Back to homepage' },
    { label: 'Events', icon: Calendar, href: '/events', description: 'Browse all events' },
    { label: 'About', icon: HelpCircle, href: '/about', description: 'Learn about us' },
    { label: 'Contact', icon: Mail, href: '/contact', description: 'Get in touch' }
  ]

  const quickLinks = footerData?.links?.resources || [
    { label: 'Privacy Policy', href: '/privacy', icon: Shield },
    { label: 'Terms of Service', href: '/terms', icon: FileText },
    { label: 'Help Center', href: '/help', icon: HelpCircle },
    { label: 'API Documentation', href: '/api-docs', icon: ExternalLink },
    { label: 'System Status', href: '/status', icon: Activity },
    { label: 'Changelog', href: '/changelog', icon: TrendingUp }
  ]

  const socialLinks = footerData?.socialLinks || [
    { label: 'Twitter', href: 'https://twitter.com/eventhub', icon: Twitter, color: 'hover:text-blue-400' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/eventhub', icon: Linkedin, color: 'hover:text-blue-600' },
    { label: 'GitHub', href: 'https://github.com/eventhub', icon: Github, color: 'hover:text-gray-900' },
    { label: 'Discord', href: 'https://discord.gg/eventhub', icon: MessageCircle, color: 'hover:text-indigo-500' }
  ]

  const adminTools = [
    { label: 'System Monitor', href: '/admin/monitor', icon: Monitor },
    { label: 'Database', href: '/admin/database', icon: Database },
    { label: 'Logs', href: '/admin/logs', icon: FileText },
    { label: 'Backup', href: '/admin/backup', icon: Download },
    { label: 'Security', href: '/admin/security', icon: Shield },
    { label: 'Performance', href: '/admin/performance', icon: Cpu }
  ]

  // Icon mapping for safe icon resolution
  const iconMap = {
    Calendar,
    Users,
    UserPlus,
    UserMinus,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    RefreshCw,
    Download,
    Upload,
    Eye,
    UserCheck,
    Bell,
    Search,
    MoreHorizontal,
    ChevronUp,
    ChevronDown,
    Settings,
    Home,
    FileText,
    BarChart3,
    Activity,
    Shield,
    Zap,
    HelpCircle,
    ExternalLink,
    Mail,
    Phone,
    MapPin,
    Github,
    Twitter,
    Linkedin,
    MessageCircle,
    Heart,
    TrendingUp,
    Database,
    Server,
    Wifi,
    WifiOff,
    AlertCircle,
    Cpu,
    HardDrive,
    Monitor
  }

  const contextualActions = () => {
    if (footerData?.contextualNavigation?.length > 0) {
      return footerData.contextualNavigation.map(item => ({
        label: item.label,
        action: item.action ? () => {
          // Safe action execution without eval
          if (item.href) navigate(item.href)
        } : () => navigate(item.href),
        icon: iconMap[item.icon] || Calendar // Safe icon resolution
      }))
    }

    // Fallback contextual actions
    if (isEventPage) {
      return [
        { label: 'Create Event', action: () => navigate('/admin/events/create'), icon: Calendar },
        { label: 'Search Events', action: () => {}, icon: Search },
        { label: 'Filter Events', action: () => {}, icon: Filter }
      ]
    }
    if (isProfilePage) {
      return [
        { label: 'Edit Profile', action: () => navigate('/profile/edit'), icon: UserCheck },
        { label: 'My Events', action: () => navigate('/profile/events'), icon: Calendar },
        { label: 'Notifications', action: () => navigate('/profile/notifications'), icon: Bell }
      ]
    }
    return []
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success-500'
      case 'connecting': return 'text-warning-500'
      case 'error': return 'text-danger-500'
      default: return 'text-gray-500'
    }
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return Wifi
      case 'connecting': return RefreshCw
      case 'error': return WifiOff
      default: return AlertCircle
    }
  }

  const ConnectionStatusIcon = getConnectionStatusIcon()

  if (isAdminPage) {
    return (
      <footer className="bg-white border-t border-gray-200 mt-auto">
        {/* Admin Quick Navigation Bar */}
        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="container-max">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-6 overflow-x-auto">
                {adminNavigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange && onTabChange(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap group ${
                      currentTab === item.id
                        ? 'bg-primary-100 text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                    {item.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        currentTab === item.id 
                          ? 'bg-primary-200 text-primary-800' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Real-time Status */}
                <div className="flex items-center space-x-2 text-sm">
                  <ConnectionStatusIcon className={`h-4 w-4 ${getConnectionStatusColor()} ${
                    connectionStatus === 'connecting' ? 'animate-spin' : ''
                  }`} />
                  <span className="text-gray-600">
                    {connectionStatus === 'connected' ? 'Live' : 
                     connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                  </span>
                </div>

                {/* System Load */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Cpu className="h-4 w-4" />
                  <span>Load: {stats.systemLoad || 0}%</span>
                </div>

                {/* Current Time */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
                
                <Link
                  to="/"
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Exit Admin</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Footer Content */}
        <div className="container-max">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-6">
              {/* Quick Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-success-500" />
                  <span>{stats.onlineUsers} online</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-primary-500" />
                  <span>{stats.totalEvents} events</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-warning-500" />
                  <span>{stats.todayRegistrations} today</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>{isExpanded ? 'Less' : 'More'}</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="border-t border-gray-100 py-6 animate-slide-up">
              <div className="grid md:grid-cols-4 gap-6">
                {/* Admin Tools */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Admin Tools</span>
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {adminTools.map(tool => (
                      <li key={tool.label}>
                        <Link 
                          to={tool.href} 
                          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors group"
                        >
                          <tool.icon className="h-3 w-3 group-hover:scale-110 transition-transform" />
                          <span>{tool.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Management */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Management</span>
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/admin/bulk-actions" className="text-gray-600 hover:text-primary-600 transition-colors">Bulk Actions</Link></li>
                    <li><Link to="/admin/templates" className="text-gray-600 hover:text-primary-600 transition-colors">Email Templates</Link></li>
                    <li><Link to="/admin/integrations" className="text-gray-600 hover:text-primary-600 transition-colors">Integrations</Link></li>
                    <li><Link to="/admin/permissions" className="text-gray-600 hover:text-primary-600 transition-colors">Permissions</Link></li>
                    <li><Link to="/admin/analytics" className="text-gray-600 hover:text-primary-600 transition-colors">Advanced Analytics</Link></li>
                    <li><Link to="/admin/reports" className="text-gray-600 hover:text-primary-600 transition-colors">Custom Reports</Link></li>
                  </ul>
                </div>
                
                {/* Support */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Support</span>
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/admin/help" className="text-gray-600 hover:text-primary-600 transition-colors">Admin Guide</Link></li>
                    <li><Link to="/admin/api" className="text-gray-600 hover:text-primary-600 transition-colors">API Reference</Link></li>
                    <li><a href="mailto:support@eventhub.com" className="text-gray-600 hover:text-primary-600 transition-colors">Contact Support</a></li>
                    <li><Link to="/admin/changelog" className="text-gray-600 hover:text-primary-600 transition-colors">What's New</Link></li>
                    <li><Link to="/admin/training" className="text-gray-600 hover:text-primary-600 transition-colors">Training Videos</Link></li>
                    <li><Link to="/admin/community" className="text-gray-600 hover:text-primary-600 transition-colors">Community Forum</Link></li>
                  </ul>
                </div>
                
                {/* System Status */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>System Status</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Database</span>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-success-500" />
                        <span className="text-success-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Email Service</span>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-success-500" />
                        <span className="text-success-600">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Storage</span>
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3 text-warning-500" />
                        <span className="text-warning-600">{stats.systemLoad || 0}% Used</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">WebSocket</span>
                      <div className="flex items-center space-x-1">
                        <ConnectionStatusIcon className={`h-3 w-3 ${getConnectionStatusColor()}`} />
                        <span className={getConnectionStatusColor()}>
                          {connectionStatus === 'connected' ? 'Connected' : 
                           connectionStatus === 'connecting' ? 'Connecting' : 'Disconnected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 mt-6 pt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              © 2024 EventHub Admin Panel. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Secure Connection</span>
              </div>
              <div className="text-sm text-gray-500">
                Version 2.1.0
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Public Footer with enhanced features
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      {/* Contextual Actions Bar */}
      {contextualActions().length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 border-b border-gray-100 shadow-soft">
          <div className="container-max py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="h-4 w-4 text-primary-600" />
                <span className="font-medium">Quick Actions:</span>
              </div>
              <div className="flex items-center space-x-3">
                {contextualActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 shadow-soft hover:shadow-medium transform hover:scale-105"
                  >
                    <action.icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="container-max py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section with Enhanced Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-display font-bold text-gradient">EventHub</span>
                <div className="text-xs text-gray-500">Professional Edition</div>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              The premier platform for discovering and managing professional events. 
              Connect with like-minded professionals and accelerate your career growth.
            </p>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">{stats.totalEvents}</div>
                <div className="text-xs text-gray-500">Active Events</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">{stats.onlineUsers}</div>
                <div className="text-xs text-gray-500">Online Users</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">{stats.todayRegistrations}</div>
                <div className="text-xs text-gray-500">Today's Signups</div>
              </div>
            </div>

            {/* Social Links with Enhanced Design */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-all duration-200 group ${social.color}`}
                  title={social.label}
                >
                  <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Enhanced Navigation */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Platform</span>
            </h3>
            <ul className="space-y-3">
              {publicNavigation.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors group"
                    title={item.description}
                  >
                    <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3" />
                  <a href="mailto:mulukenugamo8@gmail.com" className="hover:text-primary-600 transition-colors">mulukenugamo8@gmail.com</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3" />
                  <a href="tel:+251900632624" className="hover:text-primary-600 transition-colors">+251 900632624</a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Resources</span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors group"
                  >
                    <link.icon className="h-3 w-3 group-hover:scale-110 transition-transform" />
                    <span>{link.label}</span>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter Signup with Enhanced Features */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={newsletterLoading}
                    className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {newsletterMessage && (
                  <p className={`text-xs ${newsletterMessage.includes('Successfully') ? 'text-success-600' : 'text-danger-600'}`}>
                    {newsletterMessage}
                  </p>
                )}
              </form>
              
              {/* Newsletter Stats */}
              {footerData?.newsletterStats && (
                <div className="mt-3 text-xs text-gray-500">
                  Join {footerData.newsletterStats.totalSubscribers.toLocaleString()} subscribers
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container-max py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>© 2024 EventHub. All rights reserved.</span>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Built with love for the community</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Live Status */}
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-success-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className="text-gray-600">
                  {connectionStatus === 'connected' ? 'All systems operational' : 'System status unknown'}
                </span>
              </div>

              {/* Current Time */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{currentTime.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <Link to="/status" className="text-gray-500 hover:text-primary-600 transition-colors flex items-center space-x-1">
                  <Activity className="h-4 w-4" />
                  <span>System Status</span>
                </Link>
                <Link to="/security" className="text-gray-500 hover:text-primary-600 transition-colors flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default DynamicFooter