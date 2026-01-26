import { Link, useLocation } from 'react-router-dom'
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
  Zap
} from 'lucide-react'

const DynamicFooter = ({ currentTab, onTabChange }) => {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  const adminNavigation = [
    { id: 'overview', label: 'Overview', icon: BarChart3, href: '/admin' },
    { id: 'events', label: 'Events', icon: Calendar, href: '/admin/events' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'registrations', label: 'Registrations', icon: FileText, href: '/admin/registrations' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' }
  ]

  const publicNavigation = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Events', icon: Calendar, href: '/events' },
    { label: 'About', icon: HelpCircle, href: '/about' },
    { label: 'Contact', icon: ExternalLink, href: '/contact' }
  ]

  const quickLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Help Center', href: '/help' },
    { label: 'API Documentation', href: '/api-docs' }
  ]

  const socialLinks = [
    { label: 'Twitter', href: 'https://twitter.com/eventhub', icon: '🐦' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/eventhub', icon: '💼' },
    { label: 'GitHub', href: 'https://github.com/eventhub', icon: '🐙' },
    { label: 'Discord', href: 'https://discord.gg/eventhub', icon: '💬' }
  ]

  if (isAdminPage) {
    return (
      <footer className="bg-white border-t border-gray-200 mt-auto">
        {/* Admin Navigation Bar */}
        <div className="border-b border-gray-100">
          <div className="container-max">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-6 overflow-x-auto">
                {adminNavigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange && onTabChange(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      currentTab === item.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span>System Online</span>
                </div>
                <Link
                  to="/"
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                  <span>Exit Admin</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Footer Content */}
        <div className="container-max py-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Admin Tools</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/admin/analytics" className="text-gray-600 hover:text-primary-600">Advanced Analytics</Link></li>
                <li><Link to="/admin/reports" className="text-gray-600 hover:text-primary-600">Custom Reports</Link></li>
                <li><Link to="/admin/backup" className="text-gray-600 hover:text-primary-600">Data Backup</Link></li>
                <li><Link to="/admin/logs" className="text-gray-600 hover:text-primary-600">System Logs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Management</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/admin/bulk-actions" className="text-gray-600 hover:text-primary-600">Bulk Actions</Link></li>
                <li><Link to="/admin/templates" className="text-gray-600 hover:text-primary-600">Email Templates</Link></li>
                <li><Link to="/admin/integrations" className="text-gray-600 hover:text-primary-600">Integrations</Link></li>
                <li><Link to="/admin/permissions" className="text-gray-600 hover:text-primary-600">Permissions</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/admin/help" className="text-gray-600 hover:text-primary-600">Admin Guide</Link></li>
                <li><Link to="/admin/api" className="text-gray-600 hover:text-primary-600">API Reference</Link></li>
                <li><a href="mailto:support@eventhub.com" className="text-gray-600 hover:text-primary-600">Contact Support</a></li>
                <li><Link to="/admin/changelog" className="text-gray-600 hover:text-primary-600">What's New</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">System Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Database</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span className="text-success-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email Service</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    <span className="text-success-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Storage</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                    <span className="text-warning-600">75% Used</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
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

  // Public Footer
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      {/* Main Footer Content */}
      <div className="container-max py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gradient">EventHub</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              The premier platform for discovering and managing professional events. 
              Connect with like-minded professionals and accelerate your career growth.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors group"
                  title={social.label}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-3">
              {publicNavigation.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors group"
                  >
                    <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors group"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container-max py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2024 EventHub. All rights reserved. Built with ❤️ for the community.
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Zap className="h-4 w-4 text-success-500" />
                <span>Powered by cutting-edge technology</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <Link to="/status" className="text-gray-500 hover:text-primary-600 transition-colors">
                  System Status
                </Link>
                <Link to="/security" className="text-gray-500 hover:text-primary-600 transition-colors">
                  Security
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