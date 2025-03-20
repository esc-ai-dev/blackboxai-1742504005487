import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

const toastStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
}

export function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 
        ${toastStyles[type]} transform transition-transform duration-300 ease-in-out`}
      role="alert"
    >
      <div className="flex items-center space-x-2">
        {type === 'success' && (
          <i className="fas fa-check-circle" />
        )}
        {type === 'error' && (
          <i className="fas fa-exclamation-circle" />
        )}
        {type === 'info' && (
          <i className="fas fa-info-circle" />
        )}
        <span>{message}</span>
      </div>
    </div>
  )
}