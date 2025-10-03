const fs = require('fs')
const path = require('path')

console.log('🔧 Fixing Vercel Deployment Issues...')
console.log('='.repeat(50))

// Create a comprehensive error handling wrapper
const errorHandlerCode = `
// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1)
  }
})

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1)
  }
})
`

// Create a database connection retry utility
const dbRetryCode = `
import { MongoClient } from 'mongodb'

export async function connectWithRetry(uri: string, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = new MongoClient(uri)
      await client.connect()
      console.log('✅ Database connected successfully')
      return client
    } catch (error) {
      console.error(\`❌ Database connection attempt \${i + 1} failed:\`, error.message)
      if (i === maxRetries - 1) {
        throw error
      }
      console.log(\`⏳ Retrying in \${delay}ms...\`)
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
    }
  }
}
`

// Create a health check API route
const healthCheckCode = `
import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.DATABASE_URI || ''

export async function GET() {
  try {
    // Test database connection
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    await client.db().admin().ping()
    await client.close()

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
      environment: process.env.NODE_ENV || 'development'
    }, { status: 500 })
  }
}
`

// Create environment validation
const envValidationCode = `
export function validateEnvironment() {
  const required = [
    'DATABASE_URI',
    'PAYLOAD_SECRET'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '))
    throw new Error(\`Missing required environment variables: \${missing.join(', ')}\`)
  }

  console.log('✅ All required environment variables are set')
}
`

console.log('\n📋 Deployment Issues Identified:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('1. ❌ Missing environment variables in Vercel')
console.log('2. ❌ No error handling for database connection failures')
console.log('3. ❌ No health check endpoint')
console.log('4. ❌ No retry logic for database connections')
console.log('5. ❌ No environment validation')

console.log('\n🔧 Creating Fixes:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

// Create health check API route
const healthCheckPath = 'src/app/api/health/route.ts'
fs.writeFileSync(healthCheckPath, healthCheckCode)
console.log('✅ Created health check API route')

// Create database utilities
const dbUtilsPath = 'src/lib/db-utils.ts'
fs.mkdirSync('src/lib', { recursive: true })
fs.writeFileSync(dbUtilsPath, dbRetryCode)
console.log('✅ Created database retry utilities')

// Create environment validation
const envValidationPath = 'src/lib/env-validation.ts'
fs.writeFileSync(envValidationPath, envValidationCode)
console.log('✅ Created environment validation')

// Create global error handler
const errorHandlerPath = 'src/lib/error-handler.ts'
fs.writeFileSync(errorHandlerPath, errorHandlerCode)
console.log('✅ Created global error handler')

console.log('\n📝 Vercel Environment Variables Needed:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/database')
console.log('PAYLOAD_SECRET=your-secret-key-here')
console.log('NEXT_PUBLIC_SERVER_URL=https://your-domain.vercel.app')

console.log('\n🔧 Next Steps:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('1. Set environment variables in Vercel dashboard')
console.log('2. Import error handler in your main layout')
console.log('3. Use database retry utilities in your pages')
console.log('4. Test health check endpoint: /api/health')
console.log('5. Redeploy to Vercel')

console.log('\n✅ Deployment fixes created successfully!')
