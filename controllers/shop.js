const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, (fetchedProduct) => {
    res.render('shop/product-detail', {
      product: fetchedProduct,
      pageTitle: fetchedProduct.title,
      path: '/products'
    })
  });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getProducts(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const currentCartProduct = cart.products.find(prod => prod.id === product.id);
        if (currentCartProduct) {
          cartProducts.push({productData: product, qty: currentCartProduct.qty})
        }
      }

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    })
  });
};

exports.postCarts = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (fetchedProduct) => {
    Cart.addProductToCart(productId, fetchedProduct.price)
    res.redirect('/cart');
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postDeleteProduct = (req, res, next) => {
  // deleteProduct
  const productId = req.body.productId;
  Product.findById(productId, (fetchedProduct) => {
    Cart.deleteProduct(productId, fetchedProduct.price)
    res.redirect('/cart');
  })
}