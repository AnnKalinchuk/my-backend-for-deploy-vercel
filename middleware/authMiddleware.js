const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

module.exports = function(req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is missing" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "User is not authorized" });
        }

        const decodedData = jwt.verify(token, jwtSecret);
        req.user = decodedData;

        console.log('req.user in authMiddleware', req.user)

        next();
        
    } catch (e) {
        console.log(e);
        return res.status(401).json({ message: "User is not authorized" });
    }
}