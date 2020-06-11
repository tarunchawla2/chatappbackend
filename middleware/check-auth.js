const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log('Inside token token is ', token)
        const decodedToken = jwt.verify(token, "MY_JWT_KEY");
        console.log('decoded ', decodedToken)
        next();
    } catch (err) {
        res.status(401).json({
            message: 'You are not authenticated'
        })
    }
}
