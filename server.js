const App = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./app/routes/routes');
const validator = require('./app/services/validator');

require('./app/models/User');

// Parse env vars
dotenv.config();

server = new App();

// For now, parse to JSON only
// Adapt later for specific cases
server.use(bodyParser.json());

// 1. Register middlewares 
routes.forEach(route => {

    let path = route.path || null;
    let method = route.method || null;
    let controller = route.controller || null;
    let contentType = route.contentType || route.contentTypes || 'application/json';
    let constraints = route.constraints || null;

    if (path === null) {
        console.error('Attribute "path" of route is required');
        process.exit();
    }
    if (method === null) {
        console.error('Attribute "method" of route "'+ path +'" is required');
        process.exit();
    }

    // Check Content-Type header
    server[method](path, (req, res, next) => {
        let requestContentTypeHeader = req.headers['content-type'] || null;
        if (typeof contentType === 'string') contentType = [contentType];
        if (contentType.indexOf(requestContentTypeHeader) === -1) {
            res.statusCode = 415;
            res.json({
                error: 'Unsupported request ContentType: ' + (requestContentTypeHeader === null ? 'none given' : requestContentTypeHeader),
                help: 'Allowed value(s) for "Content-Type" header: ' + contentType.join(';')
            });
        }
        else next();
    });

    // Validate the payload
    if (constraints !== null) {
        server[method](path, async (req, res, next) => {
            const violations = await validator.validate(req.body, constraints);
            if (violations.length === 0) next();
            else {
                res.statusCode = 400;
                res.json({error: 'Request content validation fails', details: violations});
            }
        });
    }
    
    // Controller
    if (controller !== null) {
        server[method](path, controller);
    }

});

// 2. Middleware for non matching path
server.use((req, res, next) => {
    res.statusCode = 404;
    res.json({error: 'Unhandled endpoint'});
});

// Connect to db and then, listen for incoming connections
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    server.listen(3000, () => {
        console.log('Server is now running. Waiting for incoming requests ...');
    });
}).catch(() => {
    console.error('Unable to connect to the database');
    process.exit();
});