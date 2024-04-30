const swaggerJsDoc = require('swagger-jsdoc');

module.exports = swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskRoom API',
      version: '1.0.0',
      description: 'This is the API documentation',
    },
  },
  apis: ['src/utils/swagger.comment/*.yaml'],
});
