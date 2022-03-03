const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  //null because I'm using the same method save to create and update
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit === "true";
  //Check wether there is the edit mode on
  if(!editMode){
    res.redirect('/');
  }
  //Find the current product according to the given ID
  Product.findById(productId, fetchedProduct => {
    //If there is no such a product, then redirect the user to the home page
    if(!fetchedProduct){
      //Enhance the UX showing a error
      res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-products',
      editing: editMode,
      product: fetchedProduct
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description.trim();
  const productId = req.body.productId;

  const product = new Product(productId, title, imageUrl, description, price);
  product.save();
  res.redirect('/admin/products');
}


exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId; 
  Product.delete(productId);
  res.redirect('/products');
};
