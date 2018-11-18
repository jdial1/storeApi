window.onload = function() {
    new Vue({
        el: '#app',
        data: {
            productName: "test",
            ProductObj: {}
        },
        methods: {
            // on click function to send POST Request
            storeSearch: function() {
                axios({
                    method: 'POST',
                    url: '/storeSearch',
                    data: {
                      productName:this.productName
                    }
                }).then((res) => {
                    // On response, set nearestLoc Object equal to returned data Object
                    this.ProductObj = res.data;
                    console.log(this.ProductObj);
                });
            }
        }
    });
}
