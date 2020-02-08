const jwt = require('jsonwebtoken');

exports.signin = (req, res, next) => {
    const {username, password} = req.body;
    const payload = {username};
    const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY);
    res.json({
        token
    });
};

exports.signup = (req, res, next) => {
    res.send('SIGNUP');
};