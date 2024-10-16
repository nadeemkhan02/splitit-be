const mongoose = require("mongoose");
const Fawn = require("fawn")

module.exports = () => {
    mongoose.connect("mongodb://localhost:27017/splitit-be").then(() => {
        console.log("Connected to DB")
    })
}