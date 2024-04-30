const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const v1Router = require('../routes')
const config = require('../config')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('../utils/swagger')
const passport = require('passport')


module.exports = async (app) => {
  app.use(cors())
  app.use(express.json())
  app.use(morgan('dev'))
  app.use(bodyParser.json())

  // passport middleware
  app.use(passport.initialize())
  // api routes
  app.use(config.api.prefix, v1Router)

  // health check api
  app.get('/healthcheck', (request, response) => response.status(200).send({ message: 'healthy' }))
  // swagger api docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc))

  return app
}