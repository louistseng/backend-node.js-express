/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express');
const jwt = require('jsonwebtoken');

/**
 * @param {import('mysql2').Pool} dbPool
 */
module.exports = function build(dbPool) {
  let router = express.Router();

  // router.get('/', async (req, res, next) => {
  //   // FETCH ALL members FROM DATABASE
  //   let [rows, fields] = await dbPool.query(/* sql */ `
  //   SELECT * FROM members ORDER BY member_id ;
  //   `);
  //   res.send(rows);
  // });

  router.get('/', async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let [rows, fields] = await dbPool.query(/* sql */ `
    SELECT member_id, username, name, gender, avatar_image_src, birth_date, address,phone_number, email, created_time FROM members WHERE member_id = ?;
    `, [decoded.mid]);

    let member = rows[0];

    res.json(member);
  });

  // UPDATING
  router.put('/', async (req, res, next) => {
    const {
      name, username, gender, avatar_image_src, birth_date, address, phone_number, email, member_id,
    } = req.body;
    let [rows, fields] = await dbPool.query(/* sql */ `
    UPDATE members SET username = ?, name = ?, gender = ?, avatar_image_src = ?, birth_date = ?, address = ?, phone_number = ?, email = ? WHERE member_id = ?;
    `, [
      [name],
      [username],
      [gender],
      [avatar_image_src],
      [birth_date],
      [address],
      [phone_number],
      [email],
      [member_id],
    ]);

    res.json(rows);
  });
  // DELETING
  // router.delete('/:member_id', async (req, res, next) => {
  //   let [rows, fields] = await dbPool.query(/* sql */ `
  //   DELETE FROM members WHERE member_id = ?;
  //   `, [req.params.member_id]);
  //   res.json(rows);
  // });

  return router;
};
