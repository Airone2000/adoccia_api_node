const jwt = require('jsonwebtoken');
const SecurityService = require('./../services/security');

exports.signin = async (req, res, next) => {
    const {username, password} = req.body;
    const user = await SecurityService.signin(username, password);
    
    if (user === null) {
        res.statusCode = 401;
        res.json({error: 'Bad credentials'});
    }
    else {
        const payload = {};
        const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY);
        res.json({
            token
        });
    }
};

exports.signup = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await SecurityService.signup(username, password);
        res.statusCode = 201;
        res.json(user);
    }
    catch(err) {
        res.statusCode = 500; // What else?
        res.json({
            error: 'Unable to signup. Please, try again later'
        });
    }
};