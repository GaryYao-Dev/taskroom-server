const expressLoader = require('./express')
const dbLoader = require('./db')

exports.init = (expressApp) => {
  expressLoader(expressApp)
  dbLoader()
}