const AWS = require('aws-sdk')

const endpoint = new AWS.Endpoint(process.env.NCLOUD_OBJECT_STORAGE_ENDPOINT)
const region = 'kr-standard'
const accessKey = process.env.NCLOUD_ACCESS_KEY
const secretKey = process.env.NCLOUD_SECRET_KEY

const S3 = new AWS.S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
})

module.exports = S3
