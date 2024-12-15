const express = require('express')
const { Trip, validateTrip } = require('../models/trip')
const { User } = require('../models/user')
const router = express.Router()
const _ = require('lodash')
const auth = require('../middleware/auth')

router.get('/:id?', auth, async (req, res) => {
  if (req.params.id) {
    const trip = await Trip.findById(req.params.id)
      .populate('tripCreator', 'name email')
      .populate('tripParticipants', 'name email')
      .populate({ path: 'expenses', select: 'amount title paidBy sharedAmong' })
    if (!trip) {
      return res.status(400).send('Invalid user ID.')
    }
    return res.send(trip)
  } else {
    const userId = req.query.userId
    const isCompleted = req.query.isCompleted
    const trips = await Trip.find(
      userId ? { tripParticipants: { $in: [userId] }, isCompleted } : {}
    )
      .populate('tripCreator', 'name _id')
      .populate('tripParticipants', 'name _id')
      .populate({
        path: 'expenses',
        select: 'amount title paidBy sharedAmong',
        populate: [
          {
            path: 'sharedAmong',
            select: 'name _id',
          },
          {
            path: 'paidBy',
            select: 'name _id',
          },
        ],
      })

    // if (trips.length === 0) {
    //   return res.status(200).send('No trips found.')
    // }
    return res.send(trips)
  }
})

router.post('/addTrip', auth, async (req, res) => {
  const { value, error } = validateTrip(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const tripCreator = await User.findById(req.body.tripCreator)
  if (!tripCreator) return res.status(400).send('Invalid trip creator ID.')

  const tripParticipants = await User.find({
    _id: { $in: req.body.tripParticipants },
  })
  if (tripParticipants.length !== req.body.tripParticipants.length)
    return res.status(400).send('Invalid trip participant ID.')

  const nonPlatformParticipantsInPlatform = await User.find({
    email: { $in: req.body.nonPlatformParticipants },
  })
  if (nonPlatformParticipantsInPlatform?.length)
    return res
      .status(400)
      .send('Non-platform participants cannot be platform participants.')

  let trip = new Trip(
    _.pick(req.body, [
      'name',
      'description',
      'tripCreator',
      'tripParticipants',
      'tripDate',
      'tripStatus',
      'nonPlatformParticipants',
    ])
  )
  await trip.save()
  res.send(trip)
})

router.put('/completeTrip/:id', auth, async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(
    req.params.id,
    { $set: { isCompleted: true } }, // Only set isCompleted to true
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    }
  )
  if (!trip) {
    return res.status(400).send('Invalid trip ID.')
  }
  res.send(trip)
})

module.exports = router
