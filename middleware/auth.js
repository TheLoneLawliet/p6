const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'PotatYourHead');
        const userId = decodedToken.userId;
        req.auth = { userId: userId }
        if (req.body.userId && req.body.userId !== userId) {
            throw 'INVALID UER ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};