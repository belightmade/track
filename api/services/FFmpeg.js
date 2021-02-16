const path = require('path')
const FFmpeg = require('ffmpeg')

exports.convert = async (sourceFullPath, dist, resultFilename) => {
  const audio = await new FFmpeg(sourceFullPath)

  return new Promise((resolve, reject) =>
    audio.save(path.join(dist, resultFilename), (err, resultPath) => {
      if (err) reject(err)
      resolve(resultPath)
    })
  )
}
