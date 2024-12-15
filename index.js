const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
require('./startup/db')()
require('express-async-errors')
require('./startup/routes')(app)

const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)

const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Wellcome to SplitIt Backend')
  res.end()
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)
})
