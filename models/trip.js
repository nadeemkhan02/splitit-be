const mongoose = require('mongoose')
const joi = require('joi')

const Trip = mongoose.model(
  'Trips',
  mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    description: {
      type: String,
      required: false,
      minLength: 3,
      maxLength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tripCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    tripParticipants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Users',
    },
    tripDate: {
      type: Date,
      required: true,
    },
    tripStatus: {
      type: String,
      required: false,
      enum: ['pending', 'completed', 'cancelled', 'ongoing'],
      default: 'pending',
    },
    nonPlatformParticipants: {
      type: [String],
      required: false,
      default: [],
    },
    expenses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Expenses',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  })
)

const validateTrip = (trip) => {
  const startofToday = new Date()
  startofToday.setHours(0, 0, 0, 0)
  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    description: joi.string().min(3).max(500).required(),
    tripCreator: joi.objectId().required(),
    tripParticipants: joi.array().items(joi.objectId()).required().min(2),
    tripDate: joi
      .date()
      .required()
      .greater(startofToday)
      ?.message('Trip date cannot be a past date'),
    tripStatus: joi
      .string()
      .valid('pending', 'completed', 'cancelled', 'ongoing'),
    nonPlatformParticipants: joi.array().items(joi.string().email()),
  })
  return schema.validate(trip)
}

exports.Trip = Trip
exports.validateTrip = validateTrip
