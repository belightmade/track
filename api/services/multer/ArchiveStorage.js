const fs = require('fs')
const client = require('../../connections/ArchiveStorage')

function getDestination(req, file, cb) {
  cb(null, '../../../tmp/')
}

function ArchiveStorage(opts) {
  this.getDestination = opts.destination || getDestination
}

ArchiveStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  this.getDestination(req, file, async function (err, path) {
    if (err) return cb(err)

    try {
      const bucketName = 'track'
      const objectName = 'sample-object.wav'

      const container = client.container(bucketName)

      await container.create(objectName, file.stream)

      cb(null, {
        path,
      })
    } catch (error) {
      cb(error)
    }
  })
}

ArchiveStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  fs.unlink(file.path, cb)
}

module.exports = function (opts) {
  return new ArchiveStorage(opts)
}
