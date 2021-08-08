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

  // 全部
  router.get('/', async (req, res) => {
    let [popularProducts] = await dbPool.query(/* sql */ `
    SELECT * FROM products
    LIMIT 4
    `);
    // recipe.relatedProducts = popularProducts;

    res.json(toCamelcaseKeyedObject(popularProducts));
  });

  return router;
};
