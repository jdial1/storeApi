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
    var exactFlag=req.body.exactFlag;
    console.log("EXACT:"+exactFlag);
    var requestedProduct = req.body.productName;

    axios.get('https://redsky.target.com/v1/plp/search/?keyword='+requestedProduct)
    .then(function (response) {
      targetItems=response.data.search_response.items.Item;

      console.log("TARGET");
      console.log(targetItems.length);

      for (i in targetItems){

        targetItems[i].price=targetItems[i].offer_price.price;
        targetItems[i].itemUrl=targetItems[i].images[0].base_url+targetItems[i].images[0].primary;
        targetItems[i].storeUrl="https://blog.letterjacketenvelopes.com/wp-content/uploads/2017/01/Branding.png";
        targetItems[i].storeName="Target";


        if (exactFlag && targetItems[i].upc == requestedProduct){
            console.log("MATCH");
            console.log(targetItems[i].title);
            console.log(requestedProduct);
            products.push(targetItems[i]);
        }
        else if(!exactFlag){
            products.push(targetItems[i]);
        }
      }
      axios.get('https://www.hy-vee.com/grocery/search?search='+requestedProduct)
        .then(function (response) {
          indexStart=response.data.indexOf('Skip to main content</a></div>')+56;
          indexEnd=indexStart+response.data.substring(indexStart,response.data.length).indexOf('window.dataLayer = window.dataLayer || [];');
          hyveeItems=response.data.substring(indexStart,indexEnd-49);
          hyveeItems=eval(hyveeItems);

          console.log("Hy-Vee");

          for (i in hyveeItems){

            hyveeItems[i].title=hyveeItems[i].name;
            hyveeItems[i].storeUrl="https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Hy-Vee.svg/297px-Hy-Vee.svg.png";
            hyveeItems[i].itemUrl=hyveeItems[i].url;
            hyveeItems[i].storeName="Hy-Vee";

            if (exactFlag && hyveeItems[i].upc == requestedProduct){
                console.log("MATCH");
                console.log(hyveeItems[i].title);
                console.log(requestedProduct);
                products.push(hyveeItems[i]);
            }
            else if(!exactFlag){
                products.push(hyveeItems[i]);
            }

          }
          axios.get('https://www.walmart.com/search/api/preso?query='+requestedProduct)
            .then(function (response) {
              walmartItems=response.data.items;

              console.log("Walmart");
              console.log(walmartItems.length);

              for (i in walmartItems){

                if (walmartItems[i].hasOwnProperty('prices')){
                  if(walmartItems[i].prices.hasOwnProperty('current')){
                    walmartItems[i].price=parseInt(walmartItems[i].prices.current.amount).toFixed(2);
                  }
                  else{
                    walmartItems[i].price=parseInt(walmartItems[i].prices.base.amount).toFixed(2);
                  }
                }
                else {
                  walmartItems[i].price=0;
                }

                walmartItems[i].storeUrl="https://i5.walmartimages.com/dfw/4ff9c6c9-fd52/k2-_4f54a1b9-971b-424d-aee5-d2505212e23f.v1.png";
                walmartItems[i].title=walmartItems[i].title.replace(/<\/mark>/g, '').replace(/<mark>/g, '');
                walmartItems[i].itemUrl=walmartItems[i].images[0].url;
                //.upc
                //console.log(JSON.stringify(walmartItems[i],null,2));
                walmartItems[i].storeName="Walmart";

                if (exactFlag && walmartItems[i].upc == requestedProduct){
                    console.log("MATCH");
                    console.log(walmartItems[i].title);
                    console.log(requestedProduct);
                    products.push(walmartItems[i]);
                }
                else if(!exactFlag){
                    products.push(walmartItems[i]);
                }
              }
              console.log("----Complete---");
              res.send(products);
            })
        })
    });
});




// Start app
app.listen(port, () =>
    console.log("App Started", moment().format("MM/DD/YY h:mm a"))
);
