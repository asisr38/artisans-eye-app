'use client'

import React, { useEffect } from 'react'
import { useAuth } from '../../components/auth/AuthProvider'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect to appropriate dashboard based on user role
      const dashboardPath = user.role === 'buyer' ? '/dashboard/buyer' : '/dashboard/seller'
      router.push(dashboardPath)
    } else if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return null
}
