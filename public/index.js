window.onload = function() {
    new Vue({
        el: '#app',
        data: {
            productName: "test",
            exactFlag:false,
            ProductObj: {}
        },
        methods: {
            storeSearch: function() {
                axios({
                    method: 'POST',
                    url: '/storeSearch',
                    data: {
                      productName:this.productName,
                      exactFlag:this.exactFlag
                    }
                }).then((res) => {
                    this.ProductObj = res.data;
                    console.log(this.ProductObj);
                });
            }
        }
    });
}
