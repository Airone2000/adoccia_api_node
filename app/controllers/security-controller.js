const jwt = require('jsonwebtoken');

exports.signin = (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.statusCode = 400;
        res.json({
            error: '"username" and "password" keys must be provided in the request body'
        });
    } else {
        const payload = {username};
        const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY);
        res.json({
            token
        });
    }
};

exports.signup = (req, res, next) => {
    res.send('SIGNUP');
};