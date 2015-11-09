'use strict';

/**
 * Controller that renders our Report page.
 */
function report (request, response) {
  var contextData = {};
  response.render('report.html', contextData);
}

function report2 (request, response) {
  var contextData = {};
  response.render('report2.html', contextData);
}

function report3 (request, response) {
  var contextData = {};
  response.render('report3.html', contextData);
}

module.exports = {
   'report' : report ,
  'report2' : report2 ,
  'report3' : report3
};