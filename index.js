const express = require("express");
const app = express();
const moment = require("moment");
const path = require("path");
const axios = require("axios");
app.use(express.static('public'));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const csvFilePath = 'pharmacies.csv';
const csv = require('csvtojson');
csv().fromFile(csvFilePath);


// Default route for index.html
app.get('/', function(req, res) {
    res.render('index.html');
});

// API Route
app.post('/storeSearch', function(req, res) {
    var products=[];
    var exactFlag=false;
    var requestedProduct = req.body.productName;
    if (requestedProduct.substring(0,1) == '"' || requestedProduct.substr(-1) == '"') {
      requestedProduct = requestedProduct.replace(/"/g,'');
      exactFlag=true;
    }
    axios.get('https://redsky.target.com/v1/plp/search/?keyword='+req.body.productName)
    .then(function (response) {
      console.log('COUNT: '+Object.keys(response.data.search_response.items.Item).length);
      for (i in response.data.search_response.items.Item){
        console.log("REQ PROD: "+requestedProduct);
        console.log("PROD NAME: "+response.data.search_response.items.Item[i].title);
        if(exactFlag && response.data.search_response.items.Item[i].title == requestedProduct){
          console.log("----MATCH----");
          products.push(response.data.search_response.items.Item[i]);
          break;
        }
        else if(!exactFlag){
          products.push(response.data.search_response.items.Item[i]);
        }
      }
      res.send(products);
    })
    .catch(function (error) {
      console.log(error);
    });
});




// Start app
app.listen(5001, () =>
    console.log("App Started", moment().format("MM/DD/YY h:mm a"))
);
