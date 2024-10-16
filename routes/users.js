const express = require("express");
const { validateUser, User } = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const auth = require("../middleware/auth");


router.get("/:id?", auth, async (req, res) => {
    if (req.params.id) {
        const user = await User.findById(req.params.id);
        if (!user) res.status(400).send("Inavlid user ID");
        res.send(user);
    } else {
        const users = await User.find();
        if (users?.length === 0) res.status(404).send("No users found");
        res.send(users);
    }
})

router.post("/signUp", async (req, res) => {
    const { value, error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Email already exists");
    const { email, name, password } = req.body;
    user = new User({ email, name, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const token = user.generateJwtToken();
    res.header("auth-token", token).send(user)
    res.end();
});




module.exports = router;