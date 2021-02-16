const router = require('express').Router()
const { Artist } = require('../../models')

router.get('/', async (req, res) => {
  const artistList = await Artist.findAll()

  res.json(artistList)
})

module.exports = router
