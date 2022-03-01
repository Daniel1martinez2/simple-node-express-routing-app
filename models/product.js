const res = require('express/lib/response');
const fs = require('fs');
const path = require('path');

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
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err, "PRODUCT.js");
        });
      }else{
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err, "PRODUCT.js");
        });
      }
    });
  }

  static delete(currentId) {
    getProductsFromFile(products => {
      const existingProductIndex =  products.findIndex( prod => prod.id === currentId);
      console.log(existingProductIndex, '🐈')
      if(existingProductIndex){
        console.log("✨")
        const updatedProducts = [...products];
        updatedProducts.splice(existingProductIndex, 1);
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err, "PRODUCT.js");
        });
      }
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
