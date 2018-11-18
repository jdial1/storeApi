const express = require("express");
const app = express();
const moment = require("moment");
const path = require("path");
const axios = require("axios");
app.use(express.static('public'));

const port = process.env.PORT || 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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
      targetItems=response.data.search_response.items.Item;
      console.log(targetItems.length);
      //console.log('COUNT: '+Object.keys(response.data.search_response.items.Item).length);
      for (i in targetItems){
        //console.log("REQ PROD: "+requestedProduct);
        //console.log("PROD NAME: "+response.data.search_response.items.Item[i].title);
        targetItems[i].price=targetItems[i].offer_price.price;
        targetItems[i].store="Target";
        if(exactFlag && targetItems[i].title == requestedProduct){
          //console.log("----MATCH----");
          products.push(targetItems[i]);
          break;
        }
        else if(!exactFlag){
          products.push(targetItems[i]);
        }
      }
      axios.get('https://www.hy-vee.com/grocery/search?search='+req.body.productName)
        .then(function (response) {
          //console.log(response.data);
          indexStart=response.data.indexOf('Skip to main content</a></div>')+56;
          indexEnd=indexStart+response.data.substring(indexStart,response.data.length).indexOf('window.dataLayer = window.dataLayer || [];');
          // console.log("INDEX START: "+indexStart);
          // console.log("INDEX END: "+indexEnd);
          // console.log("LENGTH: "+response.data.length);
          // console.log(response.data.substring(indexStart,indexEnd-49));
          hyveeItems=response.data.substring(indexStart,indexEnd-49);
          console.log(hyveeItems.length);
          hyveeItems=eval(hyveeItems);
          for (i in hyveeItems){
            hyveeItems[i].title=hyveeItems[i].name;
            hyveeItems[i].store="Hy-Vee";
            console.log(hyveeItems[i].name);
            console.log(hyveeItems[i].price);
            products.push(hyveeItems[i]);
          }
          res.send(products);
        })
    });
});




// Start app
app.listen(port, () =>
    console.log("App Started", moment().format("MM/DD/YY h:mm a"))
);
