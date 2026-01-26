const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
    </div>
  )
}

export default LoadingSpinner