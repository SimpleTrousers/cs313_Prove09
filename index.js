var cool = require('cool-ascii-faces');
var pg = require('pg');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/getRate', function(request, response) {
  handleMath(request, response);
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/times', function(request, response) {
  var result = ''
  var times = process.env.TIMES || 5
  for (i=0; i < times; i++)
    result += i + ' ';
response.send(result);
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function handleMath(request, response) {
	var requestUrl = url.parse(request.url, true);

	console.log("Query parameters: " + JSON.stringify(requestUrl.query));

	// TODO: Here we should check to make sure we have all the correct parameters

  var weight = Number(requestUrl.query.weight);
	var mailType = requestUrl.query.type;

	computeOperation(response, weight, mailType);
}

function computeOperation(response, weight, type) {
	var result = 0;

	// if (type == "Letters (Stamped)") {
	// 	if (weight < 1) {
  //     result = 0.49;
  //   } else if (weight >= 1 && weight < 2) {
  //     result = 0.70;
  //   } else if (weight >= 2 && weight < 3) {
  //     result = 0.91;
  //   } else if (weight >= 3 && weight <= 3.5) {
  //     result = 1.12;
  //   } else {
  //     result = 0;
  //   }
	// } else if (type == "Letters (Metered)") {
	// 	if (weight < 1) {
  //     result = 0.46;
  //   } else if (weight >= 1 && weight < 2) {
  //     result = 0.67;
  //   } else if (weight >= 2 && weight < 3) {
  //     result = 0.88;
  //   } else if (weight >= 3 && weight <= 3.5) {
  //     result = 1.09;
  //   } else {
  //     result = 0;
  //   }	
	// } else if (type == "Large Envelopes (Flats)") {
	// 	result = 0;
	// } else if (type == "Parcels") {
	// 	result = 0;
	// } else {
	// 	// It would be best here to redirect to an "unknown operation"
	// 	// error page or something similar.
	// }

	// Set up a JSON object of the values we want to pass along to the EJS result page
	var params = {weight: weight, type: type, result: result};

	// Render the response, using the EJS page "result.ejs" in the pages directory
	// Makes sure to pass it the parameters we need.
	response.render('pages/rateCal', params);

}