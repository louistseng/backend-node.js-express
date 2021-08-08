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

  router.get('/', async (req, res, next) => {
    let [productrecipe, fields] = await dbPool.query(/* sql */ `
      SELECT * FROM recipes
      WHERE recipe_id IN (1,2,3,4)
      LIMIT 4
    `, [req.params.recipeId]);
    res.json(toCamelcaseKeyedObject(productrecipe));
  });
  return router;
};
