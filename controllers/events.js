'use strict';

var events = require('../models/events');
var validator = require('validator');
var _ = require('../node_modules/jshint/node_modules/lodash');
// Date data that would be useful to you
// completing the project These data are not
// used a first.
//
var allowedDateInfo = {
  months: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  },
  minutes: [0, 30],
  hours: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
  ],
  years: [2015, 2016],
  days: _.range(1,31)
};

/**
 * Controller that renders a list of events in HTML.
 */
function listEvents(request, response) {
  var currentTime = new Date();
  var contextData = {
    'events': _.sortByOrder(events.all,'date', false),
    'time': currentTime
  };
  response.render('event.html', contextData);
}

/**
 * Controller that renders a page for creating new events.
 */
function newEvent(request, response){
  var contextData = {allowedDateInfo: allowedDateInfo};
  response.render('create-event.html', contextData);
}

function donate(request, response){
  var contextData = {allowedDateInfo: allowedDateInfo};
  response.render('donate.html', contextData);
}

/**
 * Controller to which new events are submitted.
 * Validates the form and adds the new event to
 * our global list of events.
 */
 
function isRangedInt(number, name, min, max, errors){
  if(validator.isInt(number)){
    var numberAsInt = parseInt(number);
    if(number >= min && number <= max){
      return;
    }
  }
  errors.push(name + " should be on int in the range" + min + "to" + max);
}

function checkIntRange(request, fieldName, minVal, maxVal, contextData){
  var value = null;
  if (validator.isInt(request.body[fieldName]) === false){
    contextData.errors.push('Your' + fieldName + 'should be an integer');
  }else{
    value = parseInt(request.body[fieldName], 10);
    if (value > maxVal || value < minVal){
      contextData.errors.push('Your ' + fieldName + 'should be in the range' + minVal + '-' + maxVal);
    }
  }
  return value;
}

function saveEvent(request, response){
  var contextData = {errors: [], allowedDateInfo: allowedDateInfo};

  if (validator.isLength(request.body.title, 5, 50) === false) {
    contextData.errors.push('Your title should be between 5 and 100 letters.');
  }
  if (validator.isLength(request.body.location, 5, 50) === false) {
    contextData.errors.push('Your location should be between 5 and 100 letters.');
  }
  
  isRangedInt(request.body.year, 'year', allowedDateInfo.years[0], allowedDateInfo.years[allowedDateInfo.years.length-1], contextData.errors);
  isRangedInt(request.body.month, 'month', 0, 11, contextData.errors);
  isRangedInt(request.body.day, 'day', allowedDateInfo.days[0], allowedDateInfo.days[allowedDateInfo.days.length-1], contextData.errors);
  isRangedInt(request.body.hour, 'hour', allowedDateInfo.hours[0], allowedDateInfo.hours[allowedDateInfo.hours.length-1], contextData.errors);
  isRangedInt(request.body.minute, 'minute', allowedDateInfo.minutes[0], allowedDateInfo.minutes[allowedDateInfo.minutes.length-1], contextData.errors);
 
  /*var year = checkIntRange(request, 'year', 2015, 2016, contextData)
 
  var year = parseInt(request.body.year);
  if(year!==2015 && year!==2016 || !validator.isInt(request.body.year)){
    contextData.errors.push('Year of the event should be an integer and 2015 or 2016');
  }
  var month = parseInt(request.body.month);
  if(!validator.isInt(request.body.month) || month >11 || month < 1 ){
    contextData.errors.push('Month should be an integer and between 1 and 11');
  }
  var day = parseInt(request.body.day);
  if(!validator.isInt(request.body.day) || day > 31 || day < 1 ){
    contextData.errors.push('Day should be an integer and between 1 and 31');
  }
  var hour = parseInt(request.body.hour);
  if(!validator.isInt(request.body.hour) || hour > 23 || hour < 0 ){
    contextData.errors.push('Hour should be an integer and between 0 and 23');
  }*/
  
  var image = parseInt(request.body.image);
  if(!validator.isURL(request.body.image) || (request.body.image.match(/\.(gif|png)$/i) === null)){
    contextData.errors.push('Image should be a gif or png online');
  }
  
  
  
  
  if (contextData.errors.length === 0) {
    
// the number of the last member of AllEvents+1
    var thenewid = events.all.length+1;


    
    var newEvent = {
      id: thenewid,
      title: request.body.title,
      location: request.body.location,
      image: request.body.image,
      date: new Date,
      attending: []
    };
// this need work to get theh actual data from the form


    events.all.push(newEvent);



    response.redirect('/events/'+thenewid);

/*    response.redirect('/events/:id');  
  */   
  }else{
  
    response.render('create-event.html', contextData);
  
    
  }
}

function eventDetail (request, response) {
  var ev = events.getById(parseInt(request.params.id));
  if (ev === null) {
    response.status(404).send('No such event');
  }
  response.render('event-detail.html', {event: ev});
}

function apiDetail (request, response) {
  var ev = request.params.id;
  var output = {events: []};
  for (var i = 0; i < events.all.length ; i++){
      if(events.all[i].id == ev){
        output.events.push(events.all[i]);
        break;
      }
  }
  response.json(output);
}

function rsvp (request, response){
  var ev = events.getById(parseInt(request.params.id));
  var contextData = {errors: [], event: ev};
  if (ev === null) {
    response.status(404).send('No such event');
  }
  if(validator.isEmail(request.body.email)){
    if (validator.contains(request.body.email.toLowerCase(), '@yale.edu')){
      ev.attending.push(request.body.email);
      response.redirect('/events/' + ev.id);
    }
    else{
    contextData.errors.push('Only Yalies are allowed');
    response.render('event-detail.html', contextData);    
    }
  }
  else{
    contextData.errors.push('Invalid email');
    response.render('event-detail.html', contextData);    
  }
}
/*function api (request, response){
  var output = {events: []};
  var search = request.query.search;
  if(search){
    for (var i = 0; i < events.all.length; i++){
      if(events.all[i].title.indexOf(search) !== -1){
        output.events.push(events.all[i]);
      }else if(events.all[i].attending.indexOf(search) !== -1){
        output.events.push(events.all[i]);
      }
      }
  }
  else{
      for (var i = 0; i < events.all.length; i++){
        output.events.push(events.all[i]);
      }
    output.events = events.all;
  }
  response.json(output);
}
*/
function api (request, response){
  var output = {events: []};
  var search = request.query.search;
  
  if(search){
    for (var i = 0; i < events.all.length; i++){
      if(events.all[i].title.indexOf(search) !== -1){
        output.events.push(events.all[i]);
      }
      else{
        for (var j = 0; j < events.all[i].attending.length; j++){
          if(validator.contains(events.all[i].attending[j], search)){
            output.events.push(events.all[i]);
          }
        }
      }
      }
    }else{
      for (var i = 0; i < events.all.length; i++){
        output.events.push(events.all[i]);
      }
      output.events = events.all;
    }
    response.json(output);
  }
  


/**
 * Export all our functions (controllers in this case, because they
 * handles requests and render responses).
 */
module.exports = {
  'listEvents': listEvents,
  'eventDetail': eventDetail,
  'newEvent': newEvent,
  'donate': donate,
  'saveEvent': saveEvent,
  'isRangedInt': isRangedInt,
  'checkIntRange': checkIntRange,
  'rsvp': rsvp,
  'api': api,
  'apiDetail': apiDetail,
};