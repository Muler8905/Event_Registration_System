import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react'

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color = 'primary',
  subtitle,
  trend = [],
  isRealTime = false,
  loading = false
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Animate number changes
  useEffect(() => {
    if (typeof value === 'number' && value !== displayValue) {
      setIsAnimating(true)
      const startValue = displayValue
      const endValue = value
      const duration = 1000
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutCubic)
        
        setDisplayValue(currentValue)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }
      
      requestAnimationFrame(animate)
    } else if (typeof value === 'string') {
      setDisplayValue(value)
    }
  }, [value])

  const colorClasses = {
    primary: {
      bg: 'from-primary-600 to-primary-700',
      icon: 'text-primary-600',
      accent: 'bg-primary-50',
      border: 'border-primary-300',
      card: 'card-primary'
    },
    success: {
      bg: 'from-success-600 to-emerald-600',
      icon: 'text-success-600',
      accent: 'bg-success-50',
      border: 'border-success-300',
      card: 'card-success'
    },
    warning: {
      bg: 'from-warning-600 to-amber-600',
      icon: 'text-warning-600',
      accent: 'bg-warning-50',
      border: 'border-warning-300',
      card: 'card-warning'
    },
    secondary: {
      bg: 'from-secondary-600 to-purple-600',
      icon: 'text-secondary-600',
      accent: 'bg-secondary-50',
      border: 'border-secondary-300',
      card: 'card-secondary'
    },
    danger: {
      bg: 'from-danger-600 to-rose-600',
      icon: 'text-danger-600',
      accent: 'bg-danger-50',
      border: 'border-danger-300',
      card: 'card-danger'
    }
  }

  const changeTypeClasses = {
    increase: 'text-success-600 bg-success-100',
    decrease: 'text-danger-600 bg-danger-100',
    neutral: 'text-gray-600 bg-gray-100'
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return TrendingUp
      case 'decrease': return TrendingDown
      default: return Minus
    }
  }

  const ChangeIcon = getChangeIcon()
  const colors = colorClasses[color]

  // Mini trend chart
  const renderMiniTrend = () => {
    if (!trend || trend.length === 0) return null

    const maxValue = Math.max(...trend)
    const minValue = Math.min(...trend)
    const range = maxValue - minValue || 1

    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * 100
      const y = 100 - ((value - minValue) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="absolute bottom-0 right-0 w-20 h-8 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={colors.icon}
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={`${colors.card} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden border-l-4 ${colors.border} animate-fade-in`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className={`w-full h-full bg-gradient-to-br ${colors.bg} rounded-full transform translate-x-8 -translate-y-8 opacity-20`}></div>
      </div>

      {/* Real-time indicator */}
      {isRealTime && (
        <div className="absolute top-4 right-4 flex items-center space-x-1">
          <Zap className="h-3 w-3 text-success-500 animate-pulse" />
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
            )}
            
            <div className="flex items-baseline space-x-2 mb-3">
              <span className={`text-3xl font-bold text-gray-900 ${isAnimating ? 'animate-pulse' : ''}`}>
                {loading ? (
                  <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue
                )}
              </span>
            </div>

            {change && (
              <div className="flex items-center">
                {changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
                ) : changeType === 'decrease' ? (
                  <TrendingDown className="h-4 w-4 text-danger-500 mr-1" />
                ) : (
                  <Minus className="h-4 w-4 text-gray-500 mr-1" />
                )}
                <span className={`text-sm font-semibold ${
                  changeType === 'increase' ? 'text-success-600' : 
                  changeType === 'decrease' ? 'text-danger-600' : 'text-gray-600'
                }`}>
                  {change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            )}

            {/* Progress bar for percentage-based metrics */}
            {typeof value === 'number' && value <= 100 && title.toLowerCase().includes('rate') && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${colors.bg} transition-all duration-1000 ease-out shadow-sm`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            )}
          </div>
          
          <div className={`p-4 rounded-2xl bg-gradient-to-r ${colors.bg} shadow-lg relative transform hover:scale-110 transition-transform duration-200`}>
            <Icon className="h-8 w-8 text-white drop-shadow-sm" />
            {isRealTime && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-400 rounded-full animate-ping"></div>
            )}
          </div>
        </div>

        {/* Mini trend chart */}
        {renderMiniTrend()}
      </div>

      {/* Enhanced hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300 transform -skew-x-12 -translate-x-full hover:translate-x-full"></div>
    </div>
  )
}

export default StatsCard