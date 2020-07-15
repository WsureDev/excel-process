const express = require('express');
const router = express.Router();

const pageData = require('./index.json');

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log("Array.from(Array(10).keys()):",Array.from(Array(10).keys()));
  console.log("[...Array(10).keys()]:",[...Array(10).keys()]);
  console.log("Array.from(Array(10), (_, i) => i + 1):",Array.from(Array(10), (_, i) => i + 1));
  res.render('index', pageData);
});

module.exports = router;
