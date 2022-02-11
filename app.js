const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')


app.use(cors())
app.use(express.json())

mongoose
.connect(config.MONGODB_URI)
.then(() => {
  logger.info(`Connected to Mongo`)
})
.catch(error => {
  logger.info(`Not connected to Mongo`, error.message)
})

app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknonPath)
app.use(middleware.errorHandler)

module.exports = app