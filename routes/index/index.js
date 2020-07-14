const express = require('express');
const router = express.Router();

const pageData = require('./index.json');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', pageData);
});

module.exports = router;
