import { useEffect, useState } from 'react'

export function useNotifications() {
  const [permission, setPermission] = useState(Notification.permission)

  useEffect(() => {
    if (permission === 'default') {
      Notification.requestPermission().then(setPermission)
    }
  }, [])

  const notify = (title, body, severity = 'low') => {
    if (permission !== 'granted') return
    const icons = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵' }
    new Notification(`${icons[severity] || '⚠️'} ${title}`, {
      body,
      icon: '/vite.svg',
      tag: title, // prevents duplicate notifications
    })
  }

  return { permission, notify }
}
