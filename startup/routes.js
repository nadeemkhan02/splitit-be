const express = require("express");
const users = require("../routes/users")
const auth = require("../routes/auth")
const trips = require("../routes/trips")
const expenses = require("../routes/expenses")
const error = require("../middleware/error");
module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use("/api/trips", trips);
    app.use("/api/expenses", expenses)
    app.use(error)
}