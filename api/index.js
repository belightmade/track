const fs = require('fs')
const path = require('path')
const express = require('express')
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })

// mp3 파일 변환을 위한 임시 폴더 생성
const tmpPath = path.join(__dirname, '..', 'tmp')
if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath)

const app = express()

app.use('/v1', require('./routes/v1'))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Server error!')
})

export default app
