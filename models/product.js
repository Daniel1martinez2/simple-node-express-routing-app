const res = require('express/lib/response');
const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

const updateProducts = (updatedProducts, cb = () =>{}) => {
  fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    if(!err){
      cb()
    }else{
      console.log(err, "PRODUCT.js");
    }
  });
}

module.exports = class Product {
  constructor(
    id, 
    title, 
    imageUrl, 
    description, 
    price
  ) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if(this.id){
        const existingProductIndex = products.findIndex( prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this; 
        updateProducts(updatedProducts);
      }else{
        this.id = Math.random().toString();
        const updatedProducts = [...products];
        updatedProducts.push(this);
        updateProducts(updatedProducts);
      }
    });
  }

  static delete(currentId) {
    getProductsFromFile(products => {
      const currentProduct = products.find(prod => prod.id === currentId);
      const updatedProducts = products.filter( prod => prod.id !== currentId);
      updateProducts(updatedProducts, () => {
        Cart.deleteProduct(currentId, currentProduct.price);
      });
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb){
    getProductsFromFile( products => {
      const fetchedProduct = products.find( product => product.id === id);
      cb(fetchedProduct)
    })
  }
};
