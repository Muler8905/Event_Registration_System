import { useState, useEffect } from 'react'
import { Settings, Mail, Shield, Database, Bell, Globe, Save, RefreshCw } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const SystemSettings = () => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      siteName: 'EventHub',
      siteDescription: 'Professional Event Registration Platform',
      contactEmail: 'admin@eventhub.com',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      defaultEventCapacity: 100
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromName: 'EventHub',
      fromEmail: 'noreply@eventhub.com',
      enableWelcomeEmails: true,
      enableRegistrationEmails: true,
      enableReminderEmails: true
    },
    security: {
      requireEmailVerification: false,
      passwordMinLength: 6,
      sessionTimeout: 7,
      maxLoginAttempts: 5,
      enableTwoFactor: false,
      allowGuestRegistration: true
    },
    notifications: {
      enablePushNotifications: true,
      enableEmailNotifications: true,
      notifyOnNewRegistration: true,
      notifyOnEventCreation: true,
      notifyOnCapacityReached: true
    }
  })

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ]

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // In real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const testEmailConnection = async () => {
    setLoading(true)
    try {
      // In real app, this would test the SMTP connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Email connection test successful!')
    } catch (error) {
      toast.error('Email connection test failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center space-x-2"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                        className="input"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                        rows={3}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        className="input"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Event Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.general.defaultEventCapacity}
                        onChange={(e) => handleSettingChange('general', 'defaultEventCapacity', parseInt(e.target.value))}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Configuration</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtpHost}
                        onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtpUser}
                        onChange={(e) => handleSettingChange('email', 'smtpUser', e.target.value)}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Password
                      </label>
                      <input
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={settings.email.fromName}
                        onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={testEmailConnection}
                      disabled={loading}
                      className="btn btn-secondary flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Testing...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          <span>Test Connection</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.email.enableWelcomeEmails}
                        onChange={(e) => handleSettingChange('email', 'enableWelcomeEmails', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Send welcome emails to new users</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.email.enableRegistrationEmails}
                        onChange={(e) => handleSettingChange('email', 'enableRegistrationEmails', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Send registration confirmation emails</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.email.enableReminderEmails}
                        onChange={(e) => handleSettingChange('email', 'enableReminderEmails', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Send event reminder emails</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Password Length
                        </label>
                        <input
                          type="number"
                          min="6"
                          max="20"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          min="3"
                          max="10"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="input"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.requireEmailVerification}
                          onChange={(e) => handleSettingChange('security', 'requireEmailVerification', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Require email verification for new accounts</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.enableTwoFactor}
                          onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Enable two-factor authentication</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.allowGuestRegistration}
                          onChange={(e) => handleSettingChange('security', 'allowGuestRegistration', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Allow guest event registration</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enablePushNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'enablePushNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Enable push notifications</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enableEmailNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'enableEmailNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Enable email notifications</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.notifyOnNewRegistration}
                        onChange={(e) => handleSettingChange('notifications', 'notifyOnNewRegistration', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Notify admins on new registrations</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.notifyOnEventCreation}
                        onChange={(e) => handleSettingChange('notifications', 'notifyOnEventCreation', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Notify users when new events are created</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.notifyOnCapacityReached}
                        onChange={(e) => handleSettingChange('notifications', 'notifyOnCapacityReached', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Notify when event capacity is reached</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemSettings