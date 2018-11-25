const express = require("express");
const app = express();
const moment = require("moment");
const path = require("path");
const axios = require("axios");
axios.defaults.headers.common['User-Agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36";
axios.defaults.headers.common['Cookie'] = "build_sha=55cbe202166a90a014c379bc4a14c7fe3199d326; ahoy_visitor=2940d95b-499d-4873-bdeb-344f38b4062e; ajs_group_id=null; ajs_anonymous_id=%22bd705114-0cb9-4df1-a7a6-51b478f4b1d6%22; remember_user_token=W1s0MzE0NDA4MF0sIiQyYSQxMCRPU2xKbVBxUmoyOWRaNHJmZ29MNXRlIiwiMTU0MjU3OTU5Ni4zNjk4MzIiXQ%3D%3D--d333d0a4276b212859cb5ecb0d8eb684d47f35d3; ajs_user_id=43144080; ahoy_visit=6c061735-d466-4891-8483-f5062afae673; ahoy_track=true; _instacart_session=Q2oxcTR3TW5OWDNaN0k5ME5Ib1Q0R1V5T01WQjNqV21ndFhNemJrWlhCNEhIaDlMelU5OWlmZW8vUWtqRDlYc3JJT2huUHIvalh2b1R1WkNZS1cxZHJneHZTNEVvWHFJdmFZd2tzVGN1RVg5MWc5NUtSbXRyeFpDNUtJTHdQeEE1V0pjWnNMOUJ0elI4VGpLZkRHdnRjeEx4YkREcEtXMExPM1BUTFc0Q1Nuc0JMclhKZVN2ZEJWa2NJWmI4cGNOVTFNK0dlNE5GWjhLWXZoUUtXQWRaODc4Zk1GOHdkdG51Y3NuU21rUDhoRFBuNWFkR213Vm42M0NOQ0pRNnNzb2NWa0JTWjJ1M25YVnh6MUFLSFhQSlpVVTg0c1BWNnp4V3JsWTVVOEcwczFHQ0lSK3VxWWJvU0VNOWJVNEswR2JoaTVSaTFYUHhpbjg2SlltOXZUVkc2Z1hxYysyRXgxL2RMSWNOTUEzeGtXVmx2SWk2WlZqM1MzMFBZMEw1RVZhaVB3bjJYUkZ0ZE5TUFg0amZBeE5Gd1o2TW40cTcrbS9LK0QzSXVISjd4SkF0N3VzTGprbVN3RlRXbklvK0ZtNWZmM1RnRmwrV29Kbk1WN28yd1RNdWNPdGwraS9aamczMGo5blpWR2tycXc9LS02NVRQTUprTy9keVR2bVFiUWZkQUh3PT0%3D--bd52c13c4a933ba1390cacdb440115bb1536b728";

app.use(express.static('public'));

const port = process.env.PORT || 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const resultsPerSite = 2;

function getKeyifExist(object,key) {
 if (object.hasOwnProperty(key)){
    return object.key
 }
 else {
   return ""
 }
}
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
      for (i in targetItems.splice(0,resultsPerSite)){
       targetItems[i].price=targetItems[i].offer_price.price;
       targetItems[i].price=getKeyifExist(targetItems[i].offer_price,"price");
       targetItems[i].itemUrl=targetItems[i].images[0].base_url+targetItems[i].images[0].primary;
       targetItems[i].storeUrl="https://blog.letterjacketenvelopes.com/wp-content/uploads/2017/01/Branding.png";
       targetItems[i].storeName="Target";

      }
      console.log("Target END");

      axios.get('https://www.hy-vee.com/grocery/search?search='+requestedProduct)
        .then(function (response) {
          indexStart=response.data.indexOf('Skip to main content</a></div>')+56;
          indexEnd=indexStart+response.data.substring(indexStart,response.data.length).indexOf('window.dataLayer = window.dataLayer || [];');
          hyveeItems=response.data.substring(indexStart,indexEnd-49);
          hyveeItems=eval(hyveeItems);

         console.log("Hy-Vee");
          for (i in hyveeItems.splice(0,resultsPerSite)){
           hyveeItems[i].title=getKeyifExist(hyveeItems[i],"name");
           hyveeItems[i].storeUrl="https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Hy-Vee.svg/297px-Hy-Vee.svg.png";
           hyveeItems[i].itemUrl="";
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

          console.log("HyVee END");

         axios.get('https://www.walmart.com/search/api/preso?query='+requestedProduct)
           .then(function (response) {
              walmartItems=response.data.items;

              console.log("Walmart");
              console.log(walmartItems.length);

              for (i in walmartItems.splice(0,resultsPerSite)){

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
               walmartItems[i].itemUrl=getKeyifExist(walmartItems[i].images[0],"url");
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
             console.log("Walmart END");

             axios.get('https://www.instacart.com/v3/containers/aldi/search_v3/'+requestedProduct)
                 app.post('/storeSearch', function(req, res) {
                 for (i in aldiItems.splice(0,resultsPerSite)){
                      aldiItems[i].storeUrl="https://corporate.aldi.us/fileadmin/fm-dam/logos/ALDI_2017.png"
                     aldiItems[i].title = getKeyifExist(aldiItems[i],"name");
                     aldiItems[i].price = getKeyifExist(aldiItems[i].pricing,"price");
                     aldiItems[i].itemUrl = getKeyifExist(aldiItems[i].image,"url");
                      products.push(aldiItems[i]);
                 }

                  console.log("----Complete---");
                  res.send(products);
                })
                .catch(function (error) {
                  console.log(error)
                });
            })
        })
    });
});




// Start app
app.listen(port, () =>
    console.log("App Started", moment().format("MM/DD/YY h:mm a"))
);
