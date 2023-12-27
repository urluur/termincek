const express = require('express')
require("dotenv").config()
const cors = require('cors')
const app = express()

app.use(cors())

const db = require('./db/dbConn')

app.use('/', require('./routes/routes'))

app.listen(process.env.PORT, () => {
  console.log('Server is running on port: ' + process.env.PORT)
})
