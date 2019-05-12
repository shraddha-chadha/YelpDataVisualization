// stuff required for things to work
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let router = express.Router();
let mongoose = require('mongoose');

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// map http://URL/public route to local /public directory on the system
app.use(express.static(__dirname + '/public'));

// by default serve index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//Connect to the database
mongoose.connect('mongodb://admin:cmpe280admin@ds151820.mlab.com:51820/sputniks', { useNewUrlParser: true });

//Creating Schemas of collections
const Schema = mongoose.Schema;
const restaurantSchema = new Schema({}, {collection: 'restaurants'});

//Create Models
const restaurants = mongoose.model('restaurants', restaurantSchema);

// Define the router for /api
app.use('/api', router);

//State API
router.get('/state', function(req, res) {
    restaurants.find().distinct('state', function(err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(data);
    });
});

//City API
router.get('/city', function(req, res) {
    let state = req.query.state;
    restaurants.find({"state": state}).distinct('city', function(err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(data);
    });
});

//Restaurant Data API

//Helper functions to get Valid Categories
function getValidCategories(req, res, next) {
    let valid_categories = ["American (New)",
        "American (Traditional)",
        "Asian Fusion",
        "Bakeries",
        "Barbeque",
        "Bars",
        "Breakfast & Brunch",
        "Burgers",
        "Buffets",
        "Cafes",
        "Chinese",
        "Canadian (New)",
        "Caribbean",
        "Desserts",
        "Fast Food",
        "Fish & Chips",
        "French",
        "Indian",
        "Italian",
        "Japanese",
        "Korean",
        "Mexican",
        "Mediterranean",
        "Modern European",
        "Persian/Iranian",
        "Pizza",
        "Sandwiches",
        "Steakhouses",
        "Sushi Bars",
        "Thai",
        "Vietnamese"];
    let data = res.locals.categoryMap;
    let result = [];

    for (let category in data) {

        let temp = {"Name": category, "Count": data[category]};
        result.push(temp);
    }

    result = result.filter(function (e) {
        return valid_categories.indexOf(e.Name) > -1;
    });
    res.locals.validCategories = result;
    next();
}

//Helper functions to get category Map
function getCategoryMap(req, res, next){
    let data = res.locals.response;
    let categoryMap = {};
    for (let i = 0; i < data.length; i++) {
        let restCategoryList = data[i]._doc.categories.split(",");
        for (let j = 0; j < restCategoryList.length; j++) {
            let categoryName = restCategoryList[j].trim().replace("\"", '');
            categoryMap[categoryName] = (categoryMap[categoryName] == undefined ? 1 : categoryMap[categoryName] + 1);
        }
    }
    res.locals.categoryMap = categoryMap;
    //console.log(categoryMap);
    next();
}

let clean_data_helpers = [getCategoryMap, getValidCategories];

//API Definition
router.get('/restaurants',
    function(req, res, next)
    {
        let state, city, cuisine, filter = [];

        //Defining the filters
        if(req.query.state != undefined) {
            state = req.query.state.split(',');
            let temp = {'state': { $in: state }};
            filter.push(temp);
        }

        if(req.query.city != undefined) {
            city = req.query.city.split(',');
            let temp = {'city': { $in: city }};
            filter.push(temp);
        }

        if(req.query.cuisine != undefined) {
            cuisine = req.query.cuisine.split(',');
            let regexExp = "^";
            let len = cuisine.length;
            for(let k=0; k < len; k++) {
                regexExp += cuisine[k];
                if(k != (len - 1)) {
                    regexExp += '|^';
                }
            }
            let temp = {"categories": { "$regex": regexExp}};
            filter.push(temp);
        }
        console.log(filter);

        //Quering the database with the filters
        if(filter.length !== 0) {
            restaurants.find( {$and: filter}, function (err, data) {
                if(err) {
                    console.log('Error finding restaurants',err);
                    res.send(err);
                }
                res.locals.response = data;
                next();
            });
        }
        // Return all records since there is no filter
        else {
            restaurants.find( function(err, data) {
                if(err) {
                    console.log('Error finding restaurants',err);
                    res.send(err);
                }
                res.locals.response = data;
                next();
            });
        }
    },
    clean_data_helpers,
    function(req, res)
    {
        let originalResponse = res.locals.response;
        let validCategories = res.locals.validCategories;
        let results = {};
        let tempResult = [];
        let records_len = originalResponse.length;
        results['count'] = records_len;
        results['validCategories'] = validCategories

        for(let j =0; j < records_len; j++ ) {
            let temp = {};
            Object.assign(temp,originalResponse[j]._doc);
            tempResult.push(temp);
        }
        results['results'] = tempResult;
        // console.log("Results",results);
        res.json(results);
    }
    );

// create the server on port 8081
var server = app.listen(8081, function () {
    console.log("Yelp Data Visualization app is running on http://127.0.0.1:8081");
});