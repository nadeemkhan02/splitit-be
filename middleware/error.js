module.exports = function (err, req, res, next) {
  // TODO: Log error to database
  console.log(err, '<<')
  res.status(500).send('Something went wrong')
  next()
}
