const logger = require('./logger')

const unknonPath = (req, res) => {
  return res.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message})
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token.'
    })
  }

  next(error)
}

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
    next()
  }
  else {
    req.token = null
    next()
  }
}

module.exports = { errorHandler, requestLogger, unknonPath, tokenExtractor }