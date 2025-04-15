const jwt = require("jsonwebtoken")
// This route checks the token in the request and verifies it for me
function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({ err: "Invalid Token" })
    }
}

module.exports = verifyToken