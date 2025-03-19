const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.post('/', productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/category-product-list/:id', productController.getHighestPricedProductsByCategory)
router.get('/no-media-product-list', productController.getProductsWithNoMedia)
router.get('/price-range-product-list', productController.getProductCountByPriceRange)

module.exports = router;
