'use client'

import React from 'react'
import { useOnboarding } from './OnboardingProvider'

interface TourStep {
  id: string
  title: string
  description: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  target?: string // CSS selector for highlighting
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to The Artisan\'s Eye',
    description: 'This mystical Eye represents the connection between digital and physical artifacts. Each Eye corresponds to a unique physical artifact in our collection.',
    position: 'center'
  },
  {
    id: 'eye-interaction',
    title: 'Interact with the Eye',
    description: 'Click and drag to rotate the Eye, or tap the center to activate it. The Eye will guide you through different experiences.',
    position: 'center',
    target: '.eye-model'
  },
  {
    id: 'navigation',
    title: 'Navigate Your Journey',
    description: 'Use the navigation elements to explore Mint (create new Eyes), Showcase (view artifacts), and Panorama (immersive viewing).',
    position: 'bottom-right',
    target: '.eye-nav'
  },
  {
    id: 'mint-panel',
    title: 'Mint New Artifacts',
    description: 'The Mint panel allows you to create new digital Eyes linked to physical artifacts. Each Eye is unique and represents real-world craftsmanship.',
    position: 'top-right',
    target: '.mint-panel'
  },
  {
    id: 'exploration',
    title: 'Explore and Discover',
    description: 'Each Eye reveals different aspects of our collection. Some show panoramic views, others reveal museum scenes. Discover the stories behind each artifact.',
    position: 'center'
  }
]

export const OnboardingTour: React.FC = () => {
  const { isTourActive, currentStep, skipTour, nextStep, prevStep, completeTour } = useOnboarding()

  if (!isTourActive) return null

  const step = tourSteps[currentStep]
  const isLastStep = currentStep === tourSteps.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      completeTour()
    } else {
      nextStep()
    }
  }

  const getPositionClasses = (position: string) => {
    // Mobile defaults to bottom-centered sheet; positions apply from md and up
    switch (position) {
      case 'top-left':
        return 'md:top-4 md:left-4'
      case 'top-right':
        return 'md:top-4 md:right-4'
      case 'bottom-left':
        return 'md:bottom-4 md:left-4'
      case 'bottom-right':
        return 'md:bottom-4 md:right-4'
      case 'center':
      default:
        return 'md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2'
    }
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        {/* Highlighted target element */}
        {step.target && (
          <div 
            className="absolute bg-white/20 rounded-lg border-2 border-white/40 animate-pulse"
            style={{
              // This would need to be calculated based on the target element's position
              // For now, we'll use a placeholder
            }}
          />
        )}
        
        {/* Tour card */}
        <div className={`absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-auto ${getPositionClasses(step.position)} w-[92vw] max-w-sm md:max-w-md lg:max-w-lg mx-0 md:mx-4 pointer-events-auto`}>
          <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-4 md:p-6 shadow-2xl max-h-[70vh] overflow-y-auto pb-[max(env(safe-area-inset-bottom),1rem)]">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= currentStep ? 'bg-white' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={skipTour}
                className="text-gray-400 hover:text-white text-sm"
                aria-label="Skip tour"
              >
                Skip
              </button>
            </div>

            {/* Content */}
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">
              {step.title}
            </h3>
            <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-6 leading-relaxed">
              {step.description}
            </p>

            {/* Navigation buttons */}
            <div className="flex flex-col md:flex-row md:justify-between gap-2">
              <button
                onClick={prevStep}
                disabled={isFirstStep}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isFirstStep
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                {isLastStep ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OnboardingTour
