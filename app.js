'use strict';

// Import our express and our configuration
var express = require('express');
var configure = require('./config.js');

// Import our controllers
var indexControllers = require('./controllers/index.js');
var aboutControllers = require('./controllers/about.js');
var eventControllers = require('./controllers/events.js');
var reportControllers = require('./controllers/report.js');



// Create our express app
var app = express();

// Configure it
configure(app);

// Add routes mapping URLs to controllers
app.get('/', indexControllers.index);
app.get('/about', aboutControllers.about);
app.get('/events', eventControllers.listEvents);
app.get('/Report', reportControllers.report);
app.get('/Report2', reportControllers.report2);
app.get('/Report3', reportControllers.report3);
app.get('/events/new', eventControllers.newEvent);
app.get('/api/events', eventControllers.api);
app.get('/api/events/0', eventControllers.api);
app.post('/events/new', eventControllers.saveEvent);

module.exports = app;