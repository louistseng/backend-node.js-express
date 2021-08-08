/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const express = require('express');
const jwt = require('jsonwebtoken');

/**
 * @param {import('mysql2').Pool} dbPool
 */
module.exports = function build(dbPool) {
  let router = express.Router();

  router.post('/', async (req, res, next) => {
    const { email, password } = req.body;

    let [rows, fields] = await dbPool.query(/* sql */ `
    SELECT * FROM members WHERE email = ? AND password = ?
    `, [email, password]);
    console.log(rows);
    if (rows.length === 0) {
      return res.json({ message: '您的密碼與帳號不相符' });
    }
    const token = jwt.sign({ mid: rows[0].member_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({
      email: rows[0].email,
      name: rows[0].name,
      avatarImageSrc: rows[0].avatarImageSrc,
      id: rows[0].member_id,
      token,
    });
  });

  return router;
};
