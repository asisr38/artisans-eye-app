'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'

interface OnboardingContextType {
  hasSeenTour: boolean
  isTourActive: boolean
  currentStep: number
  startTour: () => void
  skipTour: () => void
  nextStep: () => void
  prevStep: () => void
  completeTour: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

interface OnboardingProviderProps {
  children: React.ReactNode
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [hasSeenTour, setHasSeenTour] = useState(false)
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Check if user has seen the tour before
    const seenTour = localStorage.getItem('hasSeenTour')
    if (seenTour === 'true') {
      setHasSeenTour(true)
    } else {
      // Show tour for first-time visitors after a short delay
      const timer = setTimeout(() => {
        setIsTourActive(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const startTour = () => {
    setIsTourActive(true)
    setCurrentStep(0)
  }

  const skipTour = () => {
    setIsTourActive(false)
    setHasSeenTour(true)
    localStorage.setItem('hasSeenTour', 'true')
  }

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const completeTour = () => {
    setIsTourActive(false)
    setHasSeenTour(true)
    localStorage.setItem('hasSeenTour', 'true')
  }

  const value: OnboardingContextType = {
    hasSeenTour,
    isTourActive,
    currentStep,
    startTour,
    skipTour,
    nextStep,
    prevStep,
    completeTour
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}
