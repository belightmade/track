const router = require('express').Router()

router.use('/info', require('./info'))
router.use('/file', require('./file'))
router.use('/play', require('./play'))
router.use('/playlist', require('./playlist'))

module.exports = router
