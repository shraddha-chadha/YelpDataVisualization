// stuff required for things to work
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var db;

//Connect to the database
mongoose.connect('mongodb://admin:cmpe280admin@ds151820.mlab.com:51820/sputniks');

//Creating Schemas of collections
const Schema = mongoose.Schema;
let restaurantSchema = new Schema({}, {collection: 'restaurants'});

//Create Models
const restaurants = mongoose.model('restaurants', restaurantSchema);

// map http://URL/public route to local /public directory on the system
app.use(express.static(__dirname + '/public'));

// by default serve index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//City API
app.post('/city', function(req, res) {
    restaurants.find({"state": req.body.state}).distinct('city', function(err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(data);
    });
});

//Restaurant Data API
app.post('/get_restaurant', function(req, res) {
    restaurants.find({"city": req.body.city}, function(err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(data);
    });
});

// create the server on port 8081
var server = app.listen(8081, function () {
    console.log("Yelp Data Visualization app is running on http://127.0.0.1:8081");
});