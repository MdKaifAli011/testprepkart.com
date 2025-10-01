import React from 'react'

export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tailwind CSS Test</h1>
        <div className="space-y-4">
          <div className="bg-blue-500 text-white p-4 rounded">
            <p className="font-semibold">Blue Background Test</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded">
            <p className="font-semibold">Green Background Test</p>
          </div>
          <div className="bg-red-500 text-white p-4 rounded">
            <p className="font-semibold">Red Background Test</p>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Test Button
          </button>
        </div>
      </div>
    </div>
  )
}

