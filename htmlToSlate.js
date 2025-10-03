import htmlToSlate from '@payloadcms/html-to-slate';

const html = '<p>This is <strong>bold</strong> text from CKEditor.</p>'
const slateJson = htmlToSlate(html)
console.log(slateJson)