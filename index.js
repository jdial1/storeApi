const express = require("express");
const app = express();
const moment = require("moment");
const path = require("path");
const axios = require("axios");
const _ = require('lodash');

var fmt = require('./formatting.js');


axios.defaults.headers.common['User-Agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36";
axios.defaults.headers.common['Cookie'] = "build_sha=55cbe202166a90a014c379bc4a14c7fe3199d326; ahoy_visitor=2940d95b-499d-4873-bdeb-344f38b4062e; ajs_group_id=null; ajs_anonymous_id=%22bd705114-0cb9-4df1-a7a6-51b478f4b1d6%22; remember_user_token=W1s0MzE0NDA4MF0sIiQyYSQxMCRPU2xKbVBxUmoyOWRaNHJmZ29MNXRlIiwiMTU0MjU3OTU5Ni4zNjk4MzIiXQ%3D%3D--d333d0a4276b212859cb5ecb0d8eb684d47f35d3; ajs_user_id=43144080; ahoy_visit=6c061735-d466-4891-8483-f5062afae673; ahoy_track=true; _instacart_session=Q2oxcTR3TW5OWDNaN0k5ME5Ib1Q0R1V5T01WQjNqV21ndFhNemJrWlhCNEhIaDlMelU5OWlmZW8vUWtqRDlYc3JJT2huUHIvalh2b1R1WkNZS1cxZHJneHZTNEVvWHFJdmFZd2tzVGN1RVg5MWc5NUtSbXRyeFpDNUtJTHdQeEE1V0pjWnNMOUJ0elI4VGpLZkRHdnRjeEx4YkREcEtXMExPM1BUTFc0Q1Nuc0JMclhKZVN2ZEJWa2NJWmI4cGNOVTFNK0dlNE5GWjhLWXZoUUtXQWRaODc4Zk1GOHdkdG51Y3NuU21rUDhoRFBuNWFkR213Vm42M0NOQ0pRNnNzb2NWa0JTWjJ1M25YVnh6MUFLSFhQSlpVVTg0c1BWNnp4V3JsWTVVOEcwczFHQ0lSK3VxWWJvU0VNOWJVNEswR2JoaTVSaTFYUHhpbjg2SlltOXZUVkc2Z1hxYysyRXgxL2RMSWNOTUEzeGtXVmx2SWk2WlZqM1MzMFBZMEw1RVZhaVB3bjJYUkZ0ZE5TUFg0amZBeE5Gd1o2TW40cTcrbS9LK0QzSXVISjd4SkF0N3VzTGprbVN3RlRXbklvK0ZtNWZmM1RnRmwrV29Kbk1WN28yd1RNdWNPdGwraS9aamczMGo5blpWR2tycXc9LS02NVRQTUprTy9keVR2bVFiUWZkQUh3PT0%3D--bd52c13c4a933ba1390cacdb440115bb1536b728";

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

    storeUrls = [
      axios.get(`https://redsky.target.com/v1/plp/search/?keyword=${requestedProduct}`),
      axios.get(`https://www.hy-vee.com/grocery/search?search=${requestedProduct}`),
      axios.get(`https://www.walmart.com/search/api/preso?query=${requestedProduct}`),
      axios.get(`https://www.instacart.com/v3/containers/aldi/search_v3/${requestedProduct}`)
    ];


  var urls = storeUrls.map((val, index, arr) => {return storeUrls[index]});


    axios.all(urls)
      .then(axios.spread(function (targetProds, hyveeProds,walmartProds,aldiProds) {

        products.push(
          fmt.targetFmt(targetProds),
          //fmt.hyveeFmt(hyveeProds),
          //fmt.walmartFmt(walmartProds),
          fmt.aldiFmt(aldiProds)
        );

        products = _.flattenDeep(products);
        products = products.slice(0, 10);
        console.log("----Complete---");
        console.log("PRODS RETURNED: "+Object.keys(products).length);
        res.send(products);

      }));
});




// Start app
app.listen(port, () =>
    console.log("App Started", moment().format("MM/DD/YY h:mm a"))
);
