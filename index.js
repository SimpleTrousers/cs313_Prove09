var cool = require('cool-ascii-faces');
var pg = require('pg');
var express = require('express');
var url = require("url");
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

  var weight = Number(requestUrl.query.weight);
	var mailType = requestUrl.query.type;

	computeOperation(response, weight, mailType) ;
}

function computeOperation(response, weight, type) {
	var result = 0;

	if (type == "Letters (Stamped)") {
		if (weight < 1) {
      result = 0.49;
    } else if (weight >= 1 && weight < 2) {
      result = 0.70;
    } else if (weight >= 2 && weight < 3) {
      result = 0.91;
    } else if (weight >= 3 && weight <= 3.5) {
      result = 1.12;
    } else {
      result = 0;
    }
	} else if (type == "Letters (Metered)") {
		if (weight < 1) {
      result = 0.46;
    } else if (weight >= 1 && weight < 2) {
      result = 0.67;
    } else if (weight >= 2 && weight < 3) {
      result = 0.88;
    } else if (weight >= 3 && weight <= 3.5) {
      result = 1.09;
    } else {
      result = 0;
    }	
	} else if (type == "Large Envelopes (Flats)") {
		if (weight < 1) {
      result = 0.98;
    } else if (weight >= 1 && weight < 2) {
      result = 1.19;
    } else if (weight >= 2 && weight < 3) {
      result = 1.40;
    } else if (weight >= 3 && weight < 4) {
      result = 1.61;
    } else if (weight >= 4 && weight < 5) {
      result = 1.82;
    } else if (weight >= 5 && weight < 6) {
      result = 2.03;
    } else if (weight >= 6 && weight < 7) {
      result = 2.24;
    } else if (weight >= 7 && weight < 8) {
      result = 2.45;
    } else if (weight >= 8 && weight < 9) {
      result = 2.66;
    } else if (weight >= 9 && weight < 10) {
      result = 2.87;
    } else if (weight >= 10 && weight < 11) {
      result = 3.08;
    } else if (weight >= 11 && weight < 12) {
      result = 3.29;
    } else if (weight >= 12 && weight <= 13) {
      result = 3.50;
    } else {
      result = 0;
    }	
	} else if (type == "Parcels") {
		if (weight < 1) {
      result = 6.65;
    } else if (weight >= 1 && weight < 2) {
      result = 7.20;
    } else if (weight >= 2 && weight < 3) {
      result = 7.80;
    } else if (weight >= 3 && weight < 4) {
      result = 8.50;
    } else if (weight >= 4 && weight < 5) {
      result = 9.85;
    } else if (weight >= 5 && weight < 6) {
      result = 10.40;
    } else if (weight >= 6 && weight < 7) {
      result = 11.05;
    } else if (weight >= 7 && weight < 8) {
      result = 11.40;
    } else if (weight >= 8 && weight < 9) {
      result = 11.90;
    } else if (weight >= 9 && weight < 10) {
      result = 12.65;
    } else if (weight >= 10 && weight < 11) {
      result = 13.50;
    } else if (weight >= 11 && weight < 12) {
      result = 14.25;
    } else if (weight >= 12 && weight <= 13) {
      result = 15.10;
    } else {
      result = 0;
    }
  }
  
	var params = {weight: weight, type: type, result: result};

	response.render('pages/rateCal', params);
}