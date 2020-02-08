const App = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const routes = require('./app/routes/routes');

// Parse env vars
dotenv.config();

server = new App();

// For now, parse to JSON only
// Adapt later for specific cases
server.use(bodyParser.json());

// Register middlewares 
routes.forEach(route => {

    let path = route.path || null;
    let method = route.method || null;
    let controller = route.controller || null;
    let contentType = route.contentType || route.contentTypes || 'application/json';

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
    
    // Controller
    if (controller !== null) {
        server[method](path, controller);
    }

});

server.listen(3000, () => {
    console.log('Server is now running. Waiting for incoming requests ...');
});