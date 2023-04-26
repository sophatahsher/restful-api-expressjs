'use strict';

var _express = _interopRequireDefault(require('express'));
var _bodyParser = _interopRequireDefault(require('body-parser'));
var _morgan = _interopRequireDefault(require('morgan'));
var _route = _interopRequireDefault(require('./routes/route'));
var _dotenv = _interopRequireDefault(require('dotenv'));
var _mongoconnect = _interopRequireDefault(require('./config/databases/mongoconnect'));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
var app = (0, _express['default'])();

// Server Environment
var isProd = process.env.NODE_ENV === 'production';

// https debug
app.use((0, _morgan['default'])('dev'));

// bodyParser setup
app.use(
    _bodyParser['default'].urlencoded({
        extended: true,
    }),
);
app.use(_bodyParser['default'].json());

// DB Connection
(0, _mongoconnect['default'])();

// serving static file
app.use(_express['default']['static']('public'));

// Setup Route
app.use(_route['default']);
//app.use('/', mainRouter)

_dotenv['default'].config();
var PORT = process.env.PORT || 3000;
console.log('PORT======', process.env.PORT);
app.listen(PORT, function() {
    console.log('Server is running on isProductions => '.concat(isProd));
    console.log('Your server is running on port '.concat(PORT));
});
