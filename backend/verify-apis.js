// Script to verify all APIs are working
const baseUrl = 'http://localhost:3000/api'

const endpoints = [
  { name: 'Exam Categories', url: '/exam-category' },
  { name: 'Exams', url: '/exam' },
  { name: 'Leads', url: '/leads' },
  { name: 'Posts', url: '/posts' },
  { name: 'Download Menus', url: '/download-menus' },
  { name: 'Sub Folders', url: '/sub-folders' },
  { name: 'Media', url: '/media' },
  { name: 'Statistics', url: '/stats' },
  { name: 'Exam Info', url: '/exam-info' },
  { name: 'Exam Sub Info', url: '/exam-sub-info' },
  { name: 'Users', url: '/users' }
]

async function verifyAPI(name, url) {
  try {
    const response = await fetch(`${baseUrl}${url}`)
    const data = await response.json()
    
    if (response.ok && data.success) {
      const count = data.data?.docs?.length || data.data?.length || 0
      console.log(`✅ ${name}: ${count} records`)
      return { success: true, count }
    } else {
      console.log(`❌ ${name}: API Error - ${data.error || 'Unknown error'}`)
      return { success: false, error: data.error }
    }
  } catch (error) {
    console.log(`❌ ${name}: Network Error - ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function verifyAllAPIs() {
  console.log('🔍 Verifying all APIs...')
  console.log('='.repeat(50))
  
  const results = []
  
  for (const endpoint of endpoints) {
    const result = await verifyAPI(endpoint.name, endpoint.url)
    results.push({ ...endpoint, ...result })
  }
  
  console.log('='.repeat(50))
  console.log('📊 Summary:')
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`✅ Working APIs: ${successful.length}/${endpoints.length}`)
  console.log(`❌ Failed APIs: ${failed.length}/${endpoints.length}`)
  
  if (failed.length > 0) {
    console.log('\n❌ Failed APIs:')
    failed.forEach(f => console.log(`  - ${f.name}: ${f.error}`))
  }
  
  console.log('\n🌐 Admin Panel: http://localhost:3000/admin')
  console.log('📚 API Documentation: complete-apilist.md')
}

verifyAllAPIs()
