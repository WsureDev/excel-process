const express = require('express');
const router = express.Router();
const utils = require('../../utils/index').utils;

const pageData = require('./index.json');

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log("Array.from(Array(10).keys()):",Array.from(Array(10).keys()));
  console.log("[...Array(10).keys()]:",[...Array(10).keys()]);
  console.log("Array.from(Array(10), (_, i) => i + 1):",Array.from(Array(10), (_, i) => i + 1));
  console.log(utils.replace('2020/07/13-2020/07/29','\\d','AA','g'));
  res.render('index', pageData);
});

module.exports = router;
