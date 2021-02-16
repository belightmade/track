const router = require('express').Router()
const { MetaGenre } = require('../../models')

router.get('/', async (req, res) => {
  const genreList = await MetaGenre.findAll()

  res.json(genreList)
})

module.exports = router
