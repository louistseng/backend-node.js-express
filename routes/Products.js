/* eslint-disable no-unused-vars */
const express = require('express');
const camelcaseKeys = require('camelcase-keys');

function toCamelcaseKeyedObject(obj) {
  return camelcaseKeys(
    JSON.parse(JSON.stringify(obj)),
    { deep: true },
  );
}
/**
 * @param {import('mysql2').Pool} dbPool
 */
module.exports = function build(dbPool) {
  let router = express.Router();
  // 所有商品
  router.get('/', async (req, res, next) => {
    let [productlist, fields] = await dbPool.query('SELECT products.*, product_types.name AS category_id FROM products JOIN product_types ON products.type_id = product_types.category_id');
    res.json(toCamelcaseKeyedObject(productlist));
  });
  // 單一商品
  router.get('/:productId', async (req, res, next) => {
    let [products, fields] = await dbPool.query('SELECT product_id,name,type_id,origin,specification,price,stock,image_src,description FROM products WHERE product_id = ?', [req.params.productId]);
    res.json(toCamelcaseKeyedObject(products));
  });

  return router;
};
