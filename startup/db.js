const mongoose = require('mongoose')

module.exports = () => {
  mongoose
    .connect(
      'mongodb+srv://splititUser:Splitit123@splititdb.l4vwq.mongodb.net/',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error)
      process.exit(1) // Exit process with failure code
    })
}
