const express = require('express');
const router = express.Router();
const utils = require('../../utils/index').utils;
const upload = require('../../public/config/uploader');
const excelReader = require('../../utils/excel-reader');
const excelExport = require('../../utils/excel-export');
const pageData = require('./index.json');

const dataQuery = require('../../utils/sql/dataQuery')

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log("Array.from(Array(10).keys()):",Array.from(Array(10).keys()));
  console.log("[...Array(10).keys()]:",[...Array(10).keys()]);
  console.log("Array.from(Array(10), (_, i) => i + 1):",Array.from(Array(10), (_, i) => i + 1));
  console.log(utils.replace('2020/07/13-2020/07/29','\\d','AA','g'));
  res.render('index', pageData);
});

router.post('/dataQuery',function (req,res){
  let querySql = req.body.querySql;
  let szUserId = req.body.szUserId;
  let szUserToken = req.body.szUserToken;
  let dbname = req.body.dbname;
  console.log(req.body)
  dataQuery.query(dbname,querySql,szUserId,szUserToken)
      .then( data => res.json(data))
      .catch(error => res.json(JSON.stringify(error)))
})

router.all('/exportSqlResult',upload.single('file'),async (req, res, next) => {
  let file = req.file;
  let querySql = req.body.querySql;
  let szUserId = 1447 ;//req.body.szUserId;
  let szUserToken = 'FF62B660C4C186BF37E7CD4806B347901603847279584';//req.body.szUserToken;
  let dbname = 'asgard_demeter'; //req.body.dbname;
  let step = parseInt(req.body.step);
  let target = req.body.target;

  let inputFile = await excelReader.read(req);
  let excelObject = await dataQuery.executeQuery({dbname, querySql, szUserId, szUserToken},
      inputFile[0].data, step, target)
  let result = excelExport.write(excelObject);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent(file.originalname.substring(0,file.originalname.lastIndexOf('.')))+".xlsx");
  res.end(result, 'binary');
});

module.exports = router;
