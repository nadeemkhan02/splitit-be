const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const joi = require("joi");
const config = require("config");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 300
    }
});

userSchema.methods.generateJwtToken = function () {
    return jwt.sign({ id: this._id, email: this.email, name: this.name }, config.get("jwtSecretKey"));
};

const User = mongoose.model("Users", userSchema);


const validateUser = (user) => {
    const schema = joi.object({
        name: joi.string().min(3).max(50).required(),
        email: joi.string().min(3).max(50).required().email(),
        password: joi.string().min(8).max(50).required()
    });

    return schema.validate(user);
};



exports.User = User;
exports.validateUser = validateUser;