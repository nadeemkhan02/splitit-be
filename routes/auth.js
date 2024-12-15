const express = require('express')
const router = express.Router()
const joi = require('joi')
const { User } = require('../models/user')
const bcrypt = require('bcrypt')
const _ = require('lodash')

router.post('/signIn', async (req, res) => {
  const { value, error } = validateUser(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).send('Email or password is incorrect')
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword)
    return res.status(400).send('Email or password is incorrect')
  const token = user.generateJwtToken()
  res
    .header('auth-token', token)
    .send({ ..._.pick(user, ['name', 'email', '_id']), token })
  res.end()
})

const validateUser = (user) => {
  const schema = joi.object({
    email: joi.string().min(3).max(50).required().email(),
    password: joi.string().min(8).max(50).required(),
  })
  return schema.validate(user)
}

module.exports = router
