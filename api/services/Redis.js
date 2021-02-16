const { promisify } = require('util')
const client = require('../connections/Redis')

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

const PLAYLSIT_PREFIX = 'playlist:'

exports.getPlaylist = (sessionId) =>
  getAsync(PLAYLSIT_PREFIX + sessionId).then(JSON.parse)

exports.setPlaylist = (sessionId, playlist) =>
  setAsync(PLAYLSIT_PREFIX + sessionId, JSON.stringify(playlist))
