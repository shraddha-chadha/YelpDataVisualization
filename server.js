// stuff required for things to work
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var db;

mongodb.connect('mongodb://admin:cmpe280admin@ds151820.mlab.com:51820/sputniks', { useNewUrlParser: true }, function (err, client) {
  if (err) {
    console.error(err)
    return;
  }
  db = client.db('sputniks');
});

// map http://URL/public route to local /public directory on the system
app.use(express.static(__dirname + '/public'));

// by default serve index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// example /city API
app.get('/city', function(req, res) {
    let restaurants = db.collection('restaurants');
    restaurants.find({"state": req.body.state}).distinct('city', function(err, c) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(c);
    });
});

// create the server on port 8081
var server = app.listen(8081, function () {
    console.log("Yelp Data Visualization app is running on http://127.0.0.1:8081");
});