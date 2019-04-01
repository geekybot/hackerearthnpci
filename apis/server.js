var express = require('express'),
    app = express();
var bodyParser = require('body-parser');
var app = express();
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('secret', 'thisismysecret');
app.use(bearerToken());
app.use(function (req, res, next) {
    if (req.path == "/auth/login" || req.path == "/auth/registeruser" || req.path == "/auth/registerbank") {
        return next();
    }
    else {
        var token = req.token;
        jwt.verify(token, app.get('secret'), function (err, decoded) {
            if (err) {
                res.status(401).send({
                    success: false,
                    message: 'Failed to authenticate token. Make sure to include the ' +
                        'token returned from /users call in the authorization header ' +
                        ' as a Bearer token'
                });
                return;
            } else {
                req.ethAddress = decoded.ethAddress;
                req.name = decoded.name;
                req.role = decoded.role;
                req.mobileno = decoded.mobileno;
                req.privPass = decoded.privPass;
                return next();
            }
        });
    }
});

var authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

var bankingRoutes = require('./routes/banking');
app.use('/banking', bankingRoutes);



// Server creating options
app.listen(5000, "0.0.0.0", (err, res) => {
    if (!err)
        console.info("Node started at 0.0.0.0:5000");
    else
        console.error("App is not running");
});
