const config = require('./src/config')
const errorHandler = require('./src/middleware/error-handler')
const app = require('./app')


async function startServer() {
  app.listen(config.port, (err) => {
    if (err) {
      process.exit(1)
      return
    }
    console.log(
      `########🛡️ Server listening on port: ${config.port} 🛡️ ##########`,
    )
  })
}
app.use(errorHandler)

startServer()