const express = require('express');
const { env } = require('process');
require("dotenv").config()
const app = express();

app.get('/', (req, res) => {
  res.send('Termincek backend Home!');
})

app.listen(process.env.PORT, () => {
  console.log('Server is running on port: ' + process.env.PORT);
})