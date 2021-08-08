/* eslint-disable default-case */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express');

/**
 * @param {import('mysql2').Pool} dbPool
 */
module.exports = function build(dbPool) {
  let router = express.Router();

  // 全部折價券
  router.get('/', async (req, res, next) => {
    let [rows] = await dbPool.query(/* sql */ `
    SELECT * FROM coupons ORDER BY coupon_id  ;
    `);
    res.send(rows);
  });

  // 單張折價券
  router.get('/:coupon_id', async (req, res, next) => {
    // eslint-disable-next-line quotes
    let [rows, fields] = await dbPool.query(`SELECT coupon_id, serial_number, discount_percentage, discount_amount, discount_threshold, limit_count, created_time, expired_time FROM coupons WHERE coupon_id = ?;`, [req.params.coupon_id]);
    let coupon = rows[0];
    res.send(coupon);
  });

  // 刪除折價券
  router.delete('/:coupon_id', async (req, res) => {
    // eslint-disable-next-line quotes
    let [rows] = await dbPool.query(`DELETE FROM coupons WHERE coupon_id = ?;`, [req.params.coupon_id]);
    res.send(rows);
  });

  // 新增折價券
  router.post('/', async (req, res, next) => {
    const params = req.body;

    // eslint-disable-next-line no-shadow
    // eslint-disable-next-line quotes
    let [rows] = await dbPool.query(`INSERT INTO coupons SET ?`, params, [req.params]);
    res.send(rows);
  });

  return router;
};
