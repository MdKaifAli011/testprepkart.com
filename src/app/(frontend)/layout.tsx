import React from 'react'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import './styles.css'

export const metadata: Metadata = {
  title: 'TestPrepKart - Your Gateway to Success',
  description: 'Prepare for JEE, NEET, SAT, and more with expert courses and resources',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TestPrepKart
                </h3>
                <p className="text-gray-400 text-sm">
                  Your ultimate destination for test preparation and academic excellence.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="/" className="hover:text-white transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/courses" className="hover:text-white transition-colors">
                      Courses
                    </a>
                  </li>
                  <li>
                    <a href="/blogs" className="hover:text-white transition-colors">
                      Blogs
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Exam Prep</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="/blogs/jee" className="hover:text-white transition-colors">
                      JEE Preparation
                    </a>
                  </li>
                  <li>
                    <a href="/blogs/neet" className="hover:text-white transition-colors">
                      NEET Preparation
                    </a>
                  </li>
                  <li>
                    <a href="/blogs/sat" className="hover:text-white transition-colors">
                      SAT Preparation
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Email: info@testprepkart.com</li>
                  <li>Phone: +91 1234567890</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} TestPrepKart. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
