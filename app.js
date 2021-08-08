require('dotenv/config');
const cors = require('cors');
const express = require('express');
const mysql2 = require('mysql2/promise');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recipeRouter = require('./routes/recipe');
const productsPopularRouter = require('./routes/productsPopular');
const exampleRouter = require('./routes/example');
const memberRouter = require('./routes/member');
const imageUploadRouter = require('./routes/imageUpload');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const ProductsRouter = require('./routes/Products');
const ProductRouter = require('./routes/Product');
const RecipeRecommend = require('./routes/RecipeRecommend');
const recipesRouter = require('./routes/recipes');

let app = express();
let dbPool = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dateStrings: true,
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recipe', recipeRouter(dbPool));
app.use('/example', exampleRouter(dbPool));
app.use('/member', memberRouter(dbPool));
app.use('/', imageUploadRouter(dbPool));
app.use('/products/popular', productsPopularRouter(dbPool));
app.use('/login', loginRouter(dbPool));
app.use('/register', registerRouter(dbPool));
app.use('/reciperecommend', RecipeRecommend(dbPool));
app.use('/products', ProductsRouter(dbPool));
app.use('/product', ProductRouter(dbPool));
app.use('/recipes', recipesRouter(dbPool));

module.exports = app;
