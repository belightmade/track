const router = require('express').Router()

router.use('/music', require('./music'))
router.use('/genre', require('./genre'))
router.use('/artist', require('./artist'))

module.exports = router
