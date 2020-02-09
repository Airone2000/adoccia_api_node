const controllers = require('./../controllers/security-controller');

module.exports = [

    // The visitor wants to get a JWT
    {
        path:           '/signin',
        method:         'get',
        contentType:    'application/json',
        controller:     controllers.signin,
        constraints: {
            username: {
                required: true
            },
            password: {
                required: true
            }
        }
    },

    // The visitor wants to register (new account)
    {
        path:           '/signup',
        method:         'get',
        contentType:    'application/json',
        controller:     controllers.signup,
        constraints: {
            username: {
                required: 'notBlank', // notNull , notUndefined
                minLength: 3,
                unique: {model: 'User'}
            },
            password: {
                required: 'notBlank'
            }
        }
    },
];