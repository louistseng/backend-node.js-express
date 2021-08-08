const express = require('express');

/**
 * @param {import('mysql2').Pool} dbPool
 */
module.exports = function build(dbPool) {
  let router = express.Router();

  router.get('/', async (req, res, next) => {
    let [rows, fields] = await dbPool.query(/* sql */ `
      SELECT 'Hello world!' as msg, 42 as ans;
    `);
    res.send(rows[0]);
  });

  return router;
};
