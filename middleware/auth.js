const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Unauthorized");

    try {
        const decoded = await jwt.verify(token, config.get("jwtSecretKey"));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized");
    }

}