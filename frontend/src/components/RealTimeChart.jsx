import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, DollarSign, Users, Calendar } from 'lucide-react'

const RealTimeChart = ({ data, type = 'line', title, height = 200, showLegend = true, animated = true }) => {
  const [activePoint, setActivePoint] = useState(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimationProgress(1), 100)
      return () => clearTimeout(timer)
    }
  }, [animated, data])

  const renderAdvancedLineChart = () => {
    if (!data || data.length === 0) return null

    const maxValue = Math.max(...data.map(d => Math.max(d.registrations || 0, d.revenue || 0)))
    const minValue = Math.min(...data.map(d => Math.min(d.registrations || 0, d.revenue || 0)))
    const range = maxValue - minValue || 1

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const registrationY = 100 - ((item.registrations - minValue) / range) * 80
      const revenueY = item.revenue ? 100 - ((item.revenue - minValue) / range) * 80 : null
      return { x, registrationY, revenueY, ...item }
    })

    return (
      <div className="relative" style={{ height }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Enhanced Grid */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.1"/>
            </pattern>
            <linearGradient id="registrationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map(y => (
            <g key={y}>
              <line x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.2" />
              <text x="2" y={y - 1} fontSize="2" fill="#6b7280" className="text-xs">
                {Math.round(maxValue - (y / 100) * range)}
              </text>
            </g>
          ))}
          
          {/* Registration Area */}
          <path
            d={`M 0,100 ${points.map(p => `L ${p.x},${p.registrationY}`).join(' ')} L 100,100 Z`}
            fill="url(#registrationGradient)"
            style={{
              transform: `scaleY(${animationProgress})`,
              transformOrigin: 'bottom',
              transition: 'transform 1s ease-out'
            }}
          />
          
          {/* Revenue Area (if available) */}
          {points[0]?.revenueY !== null && (
            <path
              d={`M 0,100 ${points.map(p => `L ${p.x},${p.revenueY}`).join(' ')} L 100,100 Z`}
              fill="url(#revenueGradient)"
              style={{
                transform: `scaleY(${animationProgress})`,
                transformOrigin: 'bottom',
                transition: 'transform 1s ease-out 0.2s'
              }}
            />
          )}
          
          {/* Registration Line */}
          <path
            d={`M ${points.map(p => `${p.x},${p.registrationY}`).join(' L ')}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.8"
            className="drop-shadow-sm"
            style={{
              strokeDasharray: animated ? '200' : 'none',
              strokeDashoffset: animated ? `${200 * (1 - animationProgress)}` : '0',
              transition: 'stroke-dashoffset 2s ease-out'
            }}
          />
          
          {/* Revenue Line */}
          {points[0]?.revenueY !== null && (
            <path
              d={`M ${points.map(p => `${p.x},${p.revenueY}`).join(' L ')}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="0.8"
              className="drop-shadow-sm"
              style={{
                strokeDasharray: animated ? '200' : 'none',
                strokeDashoffset: animated ? `${200 * (1 - animationProgress)}` : '0',
                transition: 'stroke-dashoffset 2s ease-out 0.3s'
              }}
            />
          )}
          
          {/* Data Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.registrationY}
                r="1.2"
                fill="#3b82f6"
                className="cursor-pointer hover:r-2 transition-all"
                onMouseEnter={() => setActivePoint({ ...point, type: 'registrations' })}
                onMouseLeave={() => setActivePoint(null)}
                style={{
                  opacity: animationProgress,
                  transform: `scale(${animationProgress})`,
                  transition: `all 0.3s ease-out ${index * 0.05}s`
                }}
              />
              {point.revenueY !== null && (
                <circle
                  cx={point.x}
                  cy={point.revenueY}
                  r="1.2"
                  fill="#10b981"
                  className="cursor-pointer hover:r-2 transition-all"
                  onMouseEnter={() => setActivePoint({ ...point, type: 'revenue' })}
                  onMouseLeave={() => setActivePoint(null)}
                  style={{
                    opacity: animationProgress,
                    transform: `scale(${animationProgress})`,
                    transition: `all 0.3s ease-out ${index * 0.05 + 0.2}s`
                  }}
                />
              )}
            </g>
          ))}
        </svg>
        
        {/* Enhanced Tooltip */}
        {activePoint && (
          <div
            className="absolute bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl pointer-events-none z-10 border border-gray-700"
            style={{
              left: `${activePoint.x}%`,
              top: `${activePoint.type === 'registrations' ? activePoint.registrationY : activePoint.revenueY}%`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="font-medium">{new Date(activePoint.date).toLocaleDateString()}</div>
            <div className="flex items-center space-x-2 mt-1">
              {activePoint.type === 'registrations' ? (
                <>
                  <Users className="h-3 w-3 text-blue-400" />
                  <span>{activePoint.registrations} registrations</span>
                </>
              ) : (
                <>
                  <DollarSign className="h-3 w-3 text-green-400" />
                  <span>${activePoint.revenue?.toLocaleString()}</span>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Legend */}
        {showLegend && (
          <div className="absolute bottom-2 right-2 flex space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span className="text-gray-600">Registrations</span>
            </div>
            {points[0]?.revenueY !== null && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderEnhancedBarChart = () => {
    if (!data || typeof data !== 'object') return null

    const entries = Object.entries(data)
    const maxValue = Math.max(...entries.map(([_, value]) => value))

    return (
      <div className="space-y-4" style={{ height }}>
        {entries.map(([key, value], index) => (
          <div key={key} className="flex items-center space-x-3">
            <div className="w-24 text-sm text-gray-600 capitalize font-medium">{key}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000 ease-out relative"
                style={{ 
                  width: `${(value / maxValue) * 100 * animationProgress}%`,
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
              </div>
            </div>
            <div className="w-12 text-sm font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">
              {((value / maxValue) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderEnhancedPieChart = () => {
    if (!data || typeof data !== 'object') return null

    const entries = Object.entries(data)
    const total = entries.reduce((sum, [_, value]) => sum + value, 0)
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
      '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
    ]
    
    let cumulativePercentage = 0
    const segments = entries.map(([key, value], index) => {
      const percentage = (value / total) * 100
      const startAngle = cumulativePercentage * 3.6
      const endAngle = (cumulativePercentage + percentage) * 3.6
      cumulativePercentage += percentage
      
      return { 
        key, 
        value, 
        percentage, 
        startAngle, 
        endAngle, 
        color: colors[index % colors.length] 
      }
    })

    return (
      <div className="flex items-center justify-center space-x-8" style={{ height }}>
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Background circle */}
            <circle cx="70" cy="70" r="60" fill="none" stroke="#f3f4f6" strokeWidth="20" />
            
            {/* Animated segments */}
            {segments.map((segment, index) => {
              const radius = 60
              const centerX = 70
              const centerY = 70
              const startAngleRad = (segment.startAngle - 90) * (Math.PI / 180)
              const endAngleRad = (segment.endAngle - 90) * (Math.PI / 180)
              
              const x1 = centerX + radius * Math.cos(startAngleRad)
              const y1 = centerY + radius * Math.sin(startAngleRad)
              const x2 = centerX + radius * Math.cos(endAngleRad)
              const y2 = centerY + radius * Math.sin(endAngleRad)
              
              const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0
              
              return (
                <path
                  key={index}
                  d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  className="hover:opacity-80 transition-all cursor-pointer"
                  style={{
                    transform: `scale(${animationProgress})`,
                    transformOrigin: '70px 70px',
                    transition: `transform 0.8s ease-out ${index * 0.1}s`
                  }}
                  onMouseEnter={() => setActivePoint(segment)}
                  onMouseLeave={() => setActivePoint(null)}
                />
              )
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Legend */}
        <div className="space-y-3">
          {segments.map((segment, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onMouseEnter={() => setActivePoint(segment)}
              onMouseLeave={() => setActivePoint(null)}
            >
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 capitalize">{segment.key}</div>
                <div className="text-xs text-gray-500">
                  {segment.value} ({segment.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tooltip for pie chart */}
        {activePoint && (
          <div className="absolute top-4 right-4 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
            <div className="font-medium capitalize">{activePoint.key}</div>
            <div>{activePoint.value} ({activePoint.percentage.toFixed(1)}%)</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          {type === 'line' && <Activity className="h-5 w-5 text-primary-600" />}
          {type === 'bar' && <BarChart3 className="h-5 w-5 text-primary-600" />}
          {type === 'pie' && <PieChart className="h-5 w-5 text-primary-600" />}
          {animated && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live Data" />
          )}
        </div>
      </div>
      
      {type === 'line' && renderAdvancedLineChart()}
      {type === 'bar' && renderEnhancedBarChart()}
      {type === 'pie' && renderEnhancedPieChart()}
    </div>
  )
}

export default RealTimeChart