const express = require('express')
const bodyParser = require('body-parser');
require("dotenv").config()
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require('./db/dbConn')

app.use('/', require('./routes/routes'))

app.listen(process.env.PORT, () => {
  console.log('Server is running on port: ' + process.env.PORT)
})
