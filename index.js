require('dotenv').load();
require('babel-core/register');

var app = require('./src');
app.start(process.env.PORT || 3000);
