const fs = require('fs')
const path = require('path')

// test.js đang nằm trong thư mục: backend/src
// nên chỉ cần trỏ tới: backend/src/templates
const text = fs.readFileSync(
    path.join(__dirname, 'templates', 'tasks.json'),
    'utf8'
)

console.log(text)
JSON.parse(text)
