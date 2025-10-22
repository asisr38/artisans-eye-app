'use client'

import React, { useState } from 'react'

interface CertificateProps {
  title: string
  artifactId: string
  authenticityDetails: {
    verifiedBy: string
    verificationDate: string
    certificateNumber: string
    physicalLocation: string
    condition: string
    materials: string[]
    dimensions: string
    provenance: string[]
  }
}

export const AuthenticityCertificate: React.FC<CertificateProps> = ({
  title,
  artifactId,
  authenticityDetails
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg p-6 text-gray-900">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-amber-800 mb-2">Certificate of Authenticity</h3>
        <p className="text-amber-700 font-medium">{title}</p>
        <p className="text-amber-600 text-sm">Digital Artifact ID: {artifactId}</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-amber-800">Verified by:</span>
            <p className="text-gray-700">{authenticityDetails.verifiedBy}</p>
          </div>
          <div>
            <span className="font-semibold text-amber-800">Date:</span>
            <p className="text-gray-700">{authenticityDetails.verificationDate}</p>
          </div>
          <div>
            <span className="font-semibold text-amber-800">Certificate #:</span>
            <p className="text-gray-700 font-mono">{authenticityDetails.certificateNumber}</p>
          </div>
          <div>
            <span className="font-semibold text-amber-800">Location:</span>
            <p className="text-gray-700">{authenticityDetails.physicalLocation}</p>
          </div>
        </div>

        <div className="border-t border-amber-300 pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-semibold text-amber-800">Detailed Information</span>
            <svg 
              className={`w-5 h-5 text-amber-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isExpanded && (
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="font-semibold text-amber-800">Condition:</span>
                <p className="text-gray-700">{authenticityDetails.condition}</p>
              </div>
              <div>
                <span className="font-semibold text-amber-800">Materials:</span>
                <p className="text-gray-700">{authenticityDetails.materials.join(', ')}</p>
              </div>
              <div>
                <span className="font-semibold text-amber-800">Dimensions:</span>
                <p className="text-gray-700">{authenticityDetails.dimensions}</p>
              </div>
              <div>
                <span className="font-semibold text-amber-800">Provenance:</span>
                <ul className="text-gray-700 list-disc list-inside">
                  {authenticityDetails.provenance.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-amber-300 pt-4 text-center">
          <p className="text-xs text-amber-600">
            This certificate verifies the authenticity and provenance of the linked physical artifact. 
            The digital Eye serves as a blockchain-based proof of ownership and authenticity.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthenticityCertificate
