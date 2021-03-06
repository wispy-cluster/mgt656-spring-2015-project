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
app.get('/donate', eventControllers.donate);
app.get('/events/new', eventControllers.newEvent);
app.get('/api/events', eventControllers.api);
app.get('/api/events/:id', eventControllers.apiDetail);
app.post('/events/new', eventControllers.saveEvent);
app.get('/events/:id', eventControllers.eventDetail);
app.post('/events/:id', eventControllers.rsvp);

app.get('/Report', reportControllers.report);
app.get('/Report2', reportControllers.report2);
app.get('/Report3', reportControllers.report3);
app.get('/Report4', reportControllers.report4);
app.get('/Report5', reportControllers.report5);
app.get('/Report6', reportControllers.report6);
app.get('/backlog', reportControllers.backlog);
app.get('/final', reportControllers.final);

module.exports = app;