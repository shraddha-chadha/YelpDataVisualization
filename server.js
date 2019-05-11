// stuff required for things to work
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let router = express.Router();
let mongoose = require('mongoose');
let db;

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Connect to the database
mongoose.connect('mongodb://admin:cmpe280admin@ds151820.mlab.com:51820/sputniks', { useNewUrlParser: true });

//Creating Schemas of collections
const Schema = mongoose.Schema;
const restaurantSchema = new Schema({}, {collection: 'restaurants'});

//Create Models
const restaurants = mongoose.model('restaurants', restaurantSchema);

// map http://URL/public route to local /public directory on the system
app.use(express.static(__dirname + '/public'));

// by default serve index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use('/api', router);

//City API
router.post('/city', function(req, res) {
    let state = req.body.state;
    restaurants.find({"state": state}).distinct('city', function(err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(data);
    });
});

//Helper functions to clean the data
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

//Helper functions to clean the data
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
let clean_data_helpers = [getCategoryMap, getValidCategories];

//Restaurant Data API
router.post('/restaurants',
function(req, res, next) {
    let city = req.body.city;
    restaurants.find({ "city": city}, function(err, data) {
            if(err) {
                console.log('Error finding restaurants',err);
                res.send(err);
            }
            res.locals.response = data;
            next();
        });

},
clean_data_helpers,
function(req, res) {
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
    results['result'] = tempResult;
    console.log("Results",results);
    res.json(results);
});

// create the server on port 8081
var server = app.listen(8081, function () {
    console.log("Yelp Data Visualization app is running on http://127.0.0.1:8081");
});