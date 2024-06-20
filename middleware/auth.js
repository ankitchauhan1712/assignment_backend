const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.status(403).json({ error: 'No token provided' });
    }
};

module.exports = authenticate;

