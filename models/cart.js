const fs = require("fs");
const path = require("path");

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProductToCart(id, productPrice) {
        //fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            }
            if(!err){
                console.log('🍣')
                cart = JSON.parse(fileContent);
            }
            //analyze the cart => find existing product
            const existingProduct = cart.products.find( prod => prod.id === id);
            let updatedProduct;
            //add new product/ increase the quantity
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty += 1;
                const currentProductIndex = cart.products.findIndex( prod => prod.id === id);
                cart.products[currentProductIndex] = updatedProduct;
            }else{
                updatedProduct = {
                    id,
                    qty: 1
                }
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice += parseInt(productPrice);
            fs.writeFile(p, JSON.stringify(cart), err => {
                if(err){
                    console.log(err, 'CART.js');
                }
            })
        })

    }
}