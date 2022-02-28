const express = require('express');
const router = express.Router();
const { getAllProductsStatic, getAllProducts } = require('../controller/products');
// const products = require('../products.json')


router.route('/').get(getAllProducts);
router.route('/static').get(getAllProductsStatic);

module.exports = router;