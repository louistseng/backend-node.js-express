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

  router.get('/:recipeId', async (req, res) => {
    let [[recipe]] = await dbPool.execute(/* sql */ `
      SELECT * FROM recipes
      WHERE recipe_id = ?
    `, [req.params.recipeId]);

    let [[author]] = await dbPool.execute(/* sql */ `
      SELECT
        member_id, name, avatar_image_src
      FROM members
      WHERE member_id = ?
    `, [recipe.author_id]);

    recipe.author = author;

    let [relatedRecipes] = await dbPool.execute(/* sql */ `
      SELECT * FROM recipes
      LIMIT ?, 4
    `, [req.params.recipeId]);

    recipe.relatedRecipes = [...relatedRecipes];

    let [reviews] = await dbPool.execute(/* sql */ `
      SELECT
        recipe_reviews.*,
        members.member_id AS m__member_id,
        members.name AS m__name,
        members.avatar_image_src AS m__avatar_image_src
      FROM recipe_reviews
      LEFT JOIN members ON recipe_reviews.member_id = members.member_id
      WHERE recipe_id = ?
    `, [req.params.recipeId]);

    reviews.forEach(review => {
      // eslint-disable-next-line no-param-reassign
      review.member = {
        member_id: review.m__member_id,
        name: review.m__name,
        avatar_image_src: review.m__avatar_image_src,
      };
    });

    recipe.reviews = reviews;

    res.json(toCamelcaseKeyedObject(recipe));
  });

  return router;
};
