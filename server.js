var express = require('express');
var app = express();
var mongo = require('mongodb');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(8081, function () {
    console.log("Example app listening at http://127.0.0.1:8081");
});