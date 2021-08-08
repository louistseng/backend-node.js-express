/* eslint-disable no-unused-vars */
const express = require('express');

/**
 * @param {import('mysql2').Pool} dbPool
 */
module.exports = function build(dbPool) {
  let router = express.Router();

  router.post('/', async (req, res, next) => {
    const {
      username, password, gender, email, date,
    } = req.body;
    let [rows, fields] = await dbPool.query(/* sql */ `
      INSERT INTO members (username, password, gender, email, birth_date) VALUES (?,?,?,?,?)
    `, [username, password, gender, email, date], (err, result) => {
      console.log(result);
    });
    res.send(rows);
  });

  return router;
};
