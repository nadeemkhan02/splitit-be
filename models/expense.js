const mongoose = require("mongoose");
const joi = require("joi");

const Expense = mongoose.model("Expenses", mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trips",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    expenseType: {
        type: String,
        required: false,
        default: "other",
        enum: ["food", "accomodation", "transportation", "other"]
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // User who made the payment
        required: true
    },
    sharedAmong: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Users with whom the expense is split
        required: true
    }],
}));


const validateExpense = (expense) => {
    const schema = joi.object({
        trip: joi.objectId().required(),
        amount: joi.number().required().min(0),
        title: joi.string().min(3).max(100).required(),
        description: joi.string().optional().max(500),
        expenseType: joi.string().valid("food", "accomodation", "transportation", "other").optional(),
        paidBy: joi.objectId().required(),
        sharedAmong: joi.array().items(joi.objectId().required()).min(2).required()
    });
    return schema.validate(expense);
};


exports.Expense = Expense;
exports.validateExpense = validateExpense;