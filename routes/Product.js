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

  router.get('/', async (req, res) => {
    if (req.query.typeId !== undefined) {
      let [products, fields] = await dbPool.query(`
        SELECT *
        FROM products 
        WHERE products.type_id = ?
      `, [req.query.typeId]);
      res.json(toCamelcaseKeyedObject(products));
    } if (req.query.categoryId !== undefined) {
      let [products, fields] = await dbPool.query(`
      SELECT products.*, 
      product_categories.name AS type_id 
      FROM products JOIN product_categories 
      ON products.type_id = product_categories.category_id 
      WHERE products.type_id = ?
      LIMIT 4
      `, [req.query.categoryId]);
      res.json(toCamelcaseKeyedObject(products));
    }
  });

  return router;
};
