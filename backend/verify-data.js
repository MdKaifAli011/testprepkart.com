// Script to verify all data is accessible via APIs
const baseUrl = 'http://localhost:3000/api'

async function verifyData() {
  console.log('🔍 Verifying data in database...')
  
  const endpoints = [
    'exam-category',
    'exam', 
    'leads',
    'posts',
    'download-menus',
    'sub-folders',
    'media'
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}/${endpoint}`)
      const data = await response.json()
      
      if (data.success && data.data.docs) {
        console.log(`✅ ${endpoint}: ${data.data.docs.length} records found`)
      } else if (data.success && data.data) {
        console.log(`✅ ${endpoint}: Data accessible`)
      } else {
        console.log(`❌ ${endpoint}: No data or error`)
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: Error - ${error.message}`)
    }
  }
  
  console.log('\n🌐 Check your admin panel at: http://localhost:3000/admin')
  console.log('📊 All data should now be visible in the admin panel!')
}

verifyData()
