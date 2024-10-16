const express = require('express')
const { Expense, validateExpense } = require('../models/expense')
const { User } = require('../models/user')
const _ = require('lodash')
const { Trip } = require('../models/trip')
const auth = require('../middleware/auth')
const router = express.Router()

//debug fawn for transactions
// const mongoose = require("mongoose");
// const Fawn = require("fawn");

router.get('/:tripId', auth, async (req, res) => {
  if (req.params.tripId) {
    const expense = await Expense.find({ trip: req.params.tripId })
      .populate({
        path: 'trip',
        select: 'name tripCreator tripParticipants tripDate tripStatus',
        populate: { path: 'tripCreator', select: 'name email' },
        populate: { path: 'tripParticipants', select: 'name email' },
      })
      .populate({ path: 'paidBy', select: 'name email' })
      .populate({ path: 'sharedAmong', select: 'name email' })
    if (!expense) return res.status(400).send('Invalid expense ID.')
    return res.send(expense)
  } else {
    //this logic is temporary removed
    // const expenses = await Expense.find().populate({ path: "trip", select: "name tripCreator tripParticipants tripDate tripStatus", populate: { path: "tripCreator", select: "name email" }, populate: { path: "tripParticipants", select: "name email" } }).populate({ path: "paidBy", select: "name email" }).populate({ path: "sharedAmong", select: "name email" });
    // return res.send(expenses);
    res.end()
  }
})

router.post('/addExpense', async (req, res) => {
  const { value, error } = validateExpense(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const trip = await Trip.findById(req.body.trip)
  if (!trip) return res.status(400).send('Invalid trip ID.')

  const paidBy = await User.findById(req.body.paidBy)
  if (!paidBy) return res.status(400).send('Invalid paid by user ID.')

  const sharedAmong = await User.find({ _id: { $in: req.body.sharedAmong } })
  if (sharedAmong.length !== req.body.sharedAmong?.length)
    return res.status(400).send('Invalid shared among user ID.')

  if (!req.body.sharedAmong.includes(req.body.paidBy))
    return res
      .status(400)
      .send('Share among users should contain the paid by user')

  //logic pending: check paidBy and sharedAmong are from the same trip

  const expense = new Expense(
    _.pick(req.body, [
      'trip',
      'amount',
      'title',
      'description',
      'expenseType',
      'paidBy',
      'sharedAmong',
    ])
  )
  trip.expenses.push(expense._id)

  await expense.save()
  await trip.save()

  expense.paidBy = paidBy
  expense.sharedAmong = sharedAmong
  expense.trip = trip?._id

  res.send(expense)
})

module.exports = router
