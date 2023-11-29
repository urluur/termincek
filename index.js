const express = require('express')
require("dotenv").config()
const app = express()

const db = require('./db/dbConn')

app.use('/', require('./routes/routes'))

app.listen(process.env.PORT, () => {
  console.log('Server is running on port: ' + process.env.PORT)
})
