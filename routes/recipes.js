const express = require('express');

/**
 * @param {import('mysql2').Pool} dbPool
 */
module.exports = function build(dbPool) {
  let router = express.Router();

  /* 食譜首頁-讀取總資料功能 */
  router.get('/', async (req, res) => {
    let [rows] = await dbPool.query(/* sql */ `
    SELECT 
    recipes.*,
    members.member_id AS m__member_id,
    members.name AS m__name,
    members.avatar_image_src AS m__avatar_image_src 
    FROM recipes 
    LEFT JOIN members ON recipes.author_id = members.member_id
    LIMIT 60; 
    `);
    res.send(rows);
  });

  /* 食譜收藏頁面-讀取資料功能 */
  router.get('/collection', async (req, res) => {
    let [rows] = await dbPool.query(/* sql */ `
      SELECT 
      recipe_collection.*,
      recipes.*,
      members.name AS m__name,
      members.avatar_image_src AS m__avatar_image_src 
      FROM recipe_collection
      LEFT JOIN recipes
      ON recipe_collection.recipe_id = recipes.recipe_id
      LEFT JOIN members 
      ON recipes.author_id = members.member_id
      `);
    res.send(rows);
  });

  /* 食譜首頁-側邊欄-推薦資料分類功能 */
  router.get('/:content_id', async (req, res) => {
    let [rows] = await dbPool.query(/* sql */ `
    SELECT * FROM recipes LIMIT 10 OFFSET ${req.params.content_id};
    `);
    res.send(rows);
  });

  /* 食譜首頁-收藏功能 */
  router.post('/collect', async (req, res) => {
    const { recipe_id, member_id } = req.body;
    let [rows] = await dbPool.query(/* sql */ `
    INSERT INTO recipe_collection (recipe_id, member_id)
    VALUES ( ?, ? );`, [recipe_id, member_id]);
    res.send(rows);
  });

  /*
  食譜收藏頁面-收藏刪除功能 */
  router.delete('/delete/:recipe_id', async (req, res) => {
    let [rows] = await dbPool.query(/* sql */ `
    DELETE FROM recipe_collection 
    WHERE recipe_id ='${req.params.recipe_id}';
     `);
    res.send(rows);
  });

  return router;
};
