require('dotenv').config();
const express = require('express');
const testApp = express();

const errorHandler = require('../middleware/error-handler');
const cors = require('cors');
const morgan = require('morgan');
const v1Router = require('../routes');
const config = require('../config');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('../utils/swagger');
const passport = require('passport');



testApp.use(cors())
testApp.use(express.json())
testApp.use(morgan('dev'))
testApp.use(bodyParser.json())

testApp.use(passport.initialize());

testApp.use(config.api.prefix, v1Router)

// health check api
testApp.get('/healthcheck', (request, response) =>
  response.status(200).send({ message: 'healthy' }),
);
// swagger api docs
testApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

testApp.use(errorHandler);

module.exports = testApp;
