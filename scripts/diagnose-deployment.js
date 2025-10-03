const { execSync } = require('child_process')

console.log('🔍 Diagnosing Vercel Deployment Issues...')
console.log('='.repeat(50))

// Check environment variables
console.log('\n📋 Environment Variables Check:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

const requiredEnvVars = ['DATABASE_URI', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL']

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar]
  if (value) {
    if (envVar === 'DATABASE_URI') {
      // Mask sensitive parts
      const masked = value.replace(/\/\/[^:]+:[^@]+@/, '//*****:*****@')
      console.log(`✅ ${envVar}: ${masked}`)
    } else {
      console.log(`✅ ${envVar}: ${value.substring(0, 20)}...`)
    }
  } else {
    console.log(`❌ ${envVar}: NOT SET`)
  }
})

// Check build process
console.log('\n🔨 Build Process Check:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

try {
  console.log('Testing TypeScript compilation...')
  execSync('npx tsc --noEmit', { stdio: 'pipe' })
  console.log('✅ TypeScript compilation successful')
} catch (error) {
  console.log('❌ TypeScript compilation failed')
  console.log('Error:', error.message)
}

try {
  console.log('Testing Next.js build...')
  execSync('npm run build', { stdio: 'pipe', timeout: 60000 })
  console.log('✅ Next.js build successful')
} catch (error) {
  console.log('❌ Next.js build failed')
  console.log('Error:', error.message)
}

// Check for common deployment issues
console.log('\n🚨 Common Deployment Issues:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

console.log('1. Database Connection Issues:')
console.log('   - Check if DATABASE_URI is correctly set in Vercel')
console.log('   - Ensure MongoDB Atlas allows connections from Vercel IPs')
console.log('   - Verify database credentials are correct')

console.log('\n2. Environment Variables:')
console.log('   - Ensure all required env vars are set in Vercel dashboard')
console.log('   - Check if PAYLOAD_SECRET is set and secure')

console.log('\n3. Build Issues:')
console.log('   - Check Node.js version compatibility')
console.log('   - Ensure all dependencies are properly installed')
console.log('   - Verify no TypeScript errors in build')

console.log('\n4. Runtime Issues:')
console.log('   - Check for unhandled promise rejections')
console.log('   - Verify database queries are properly wrapped in try-catch')
console.log('   - Ensure all imports are correct')

console.log('\n💡 Recommended Fixes:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('1. Add error boundaries to catch runtime errors')
console.log('2. Add database connection retry logic')
console.log('3. Add proper error logging')
console.log('4. Test locally with production environment variables')
console.log('5. Check Vercel function logs for specific error messages')

console.log('\n🔧 Next Steps:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('1. Check Vercel dashboard for detailed error logs')
console.log('2. Test database connection from Vercel environment')
console.log('3. Add error handling to all async operations')
console.log('4. Consider adding health check endpoints')
