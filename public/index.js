window.onload = function() {
    new Vue({
        el: '#app',
        data: {
            productName: "test",
            exactFlag:false,
            ProductList: {}
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
                    this.ProductList = res.data;
                    console.log(this.ProductList);
                });
            }
        }
    });
}
