

module.exports = {
  targetFmt: function (response){
    var products = [];
    targetItems=response.data.search_response.items.Item;

    console.log("TARGET");
    console.log(targetItems.length);

    for (i in targetItems.splice(0,2)){
      targetItems[i].price=targetItems[i].offer_price.price;
      targetItems[i].itemUrl=targetItems[i].images[0].base_url+targetItems[i].images[0].primary;
      targetItems[i].storeUrl="https://blog.letterjacketenvelopes.com/wp-content/uploads/2017/01/Branding.png";
      targetItems[i].storeName="Target";
      products.push(targetItems[i]);

    }
    console.log("Target END");
    return products;
  },


  hyveeFmt : function (response){
    var products = [];
    indexStart=response.data.indexOf('Skip to main content</a></div>')+56;
    indexEnd=indexStart+response.data.substring(indexStart,response.data.length).indexOf('window.dataLayer = window.dataLayer || [];');
    hyveeItems=response.data.substring(indexStart,indexEnd-49);
    hyveeItems=eval(hyveeItems);

    console.log("Hy-Vee");
    console.log(hyveeItems.length);
    console.log(hyveeItems[0]);

    for (i in hyveeItems.splice(0,5)){
      console.log(hyveeItems[i]);
      console.log(Object.keys(hyveeItems[i]))
      hyveeItems[i].title=hyveeItems[i].name;
      hyveeItems[i].storeUrl="https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Hy-Vee.svg/297px-Hy-Vee.svg.png";
      hyveeItems[i].itemUrl="";
      hyveeItems[i].storeName="Hy-Vee";

      products.push(hyveeItems[i]);

    }
    console.log("HyVee END");
    return products;
  },

  walmartFmt: function (response) {
    var products = [];
    walmartItems=response.data.items;

    console.log("Walmart");
    console.log(walmartItems.length);

    for (i in walmartItems.splice(0,5)){

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
      products.push(walmartItems[i]);

    }
    console.log("Walmart END");
    return products;
  },



  aldiFmt: function (response) {
    var products = [];
    var aldiItems = response.data.container.modules[1].data.items;

    console.log("Aldi");
    for (i in aldiItems){
        console.log(aldiItems[i].name);
        aldiItems[i].storeUrl="https://corporate.aldi.us/fileadmin/fm-dam/logos/ALDI_2017.png"
        aldiItems[i].title = aldiItems[i].name;
        aldiItems[i].price = aldiItems[i].pricing.price;
        aldiItems[i].itemUrl = aldiItems[i].image.url;
        products.push(aldiItems[i]);
    }
    console.log("Aldi END");
    return products;
  }
};
