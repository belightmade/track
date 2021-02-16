const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const s3UploadStream = require('s3-upload-stream')
const S3 = require('../../connections/ObjectStorage')
const s3Stream = s3UploadStream(S3)

function getDestination(req, file, cb) {
  cb(null, path.join(__dirname, '../../../tmp/'))
}

function ObjectStorage(opts) {
  this.getDestination = opts.destination || getDestination
}

ObjectStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  this.getDestination(req, file, function (err, path) {
    if (err) return cb(err)

    try {
      const id = uuidv4()
      const extension = file.mimetype.split('/')[1]
      const Bucket = process.env.NCLOUD_BUCKET_NAME
      const Key = id + '.' + extension

      const upload = s3Stream.upload({ Bucket, Key, ACL: 'public-read' })
      const outStream = fs.createWriteStream(path + Key)

      file.stream.pipe(upload)
      file.stream.pipe(outStream)

      let fileSize = 0

      upload.on('error', (error) => {
        cb(error)
      })

      upload.on('part', (details) => {
        fileSize = details.receivedSize
      })

      upload.on('uploaded', ({ Location, ETag }) => {
        cb(null, {
          path,
          id,
          bucket: Bucket,
          name: Key,
          location: Location,
          size: fileSize,
          etag: ETag,
        })
      })
    } catch (error) {
      cb(error)
    }
  })
}

ObjectStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  fs.unlink(file.path, cb)
}

module.exports = function (opts) {
  return new ObjectStorage(opts)
}
