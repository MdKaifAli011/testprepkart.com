import React from 'react'

export default function DebugCSSPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      <div
        style={{
          maxWidth: '28rem',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
        }}
      >
        <h1
          style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}
        >
          CSS Debug Page
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Tailwind Classes Test */}
          <div className="bg-blue-500 text-white p-4 rounded">
            <p className="font-semibold">Tailwind: Blue Background</p>
          </div>

          {/* Inline Styles Test */}
          <div
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '1rem',
              borderRadius: '0.25rem',
            }}
          >
            <p style={{ fontWeight: '600' }}>Inline: Green Background</p>
          </div>

          {/* Mixed Test */}
          <div
            className="bg-red-500"
            style={{ color: 'white', padding: '1rem', borderRadius: '0.25rem' }}
          >
            <p className="font-semibold">Mixed: Red Background</p>
          </div>

          {/* Button Test */}
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
            style={{ width: '100%' }}
          >
            Test Button (Tailwind + Inline)
          </button>
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.25rem',
          }}
        >
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Diagnosis:</h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
            <li>If blue box is blue: Tailwind is working</li>
            <li>If green box is green: Inline styles work</li>
            <li>If red box is red: Mixed styles work</li>
            <li>If button is purple: Tailwind classes work</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


