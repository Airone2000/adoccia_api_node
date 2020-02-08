const controllers = require('./../controllers/security-controller');

module.exports = [

    // The visitor wants to get a JWT
    {
        path:           '/signin',
        method:         'get',
        contentType:    'application/json',
        controller:     controllers.signin
    },

    // The visitor wants to register (new account)
    {
        path:           '/signup',
        method:         'get',
        contentType:    'application/json',
        controller:     controllers.signup
    },
];