const express = require('express');
const router = express.Router();
const upload = require('../../public/config/uploader');
const excelReader = require('../../utils/excel-reader');
const excelExport = require('../../utils/excel-export');
const excelJson = require('./excel.json');
const excelProcess = require('../../utils/process').processer;
const utils = require('../../utils/index').utils;

router.get('/',(req, res, next) => {
    res.render('excel',excelJson);
});

/* GET users listing. */
router.all('/upload',upload.single('file'),async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    let excelObject = {};
    await createExcelObject(req,res,excelObject);
    res.json(dateFormat(excelObject));
});

router.all('/download',upload.single('file'),async (req, res, next) => {
    let file = req.file;
    let strategy = req.body.strategy;
    let excelObject = {};
    try {
        await createExcelObject(req,res,excelObject);
        dateFormat(excelObject);
        console.log(excelObject);
        if(!utils.isBlank(strategy)){
            let strategyList = JSON.parse(strategy);
            strategyList.forEach( s => {
                excelProcess[s.name](excelObject,s.options);
            })
        }
    }catch (e) {
        res.json({"error":e.message});
        return ;
    }
    let result = excelExport.write(excelObject);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent(file.originalname.substring(0,file.originalname.lastIndexOf('.')))+".xlsx");
    res.end(result, 'binary');
});



async function createExcelObject(req,res,excelObject) {
    let cols = req.body.cols,colsArray = [];

    if(cols === undefined || cols === null || cols === ''){
        res.json({"errorMessage":"列为空"});
        return ;
    }

    let sheet = parseInt(req.body.sheet);
    if(isNaN(sheet) || sheet<0){
        res.json({"errorMessage":"sheet未选择"});
        return ;
    }
    let result = await excelReader.read(req);
    if(sheet > result.length-1){
        res.json({"errorMessage":"sheet超限"});
        return ;
    }

    excelObject.sheet = sheet;
    excelObject.column = result[sheet].column;
    excelObject.data = result[sheet].data;

    colsArray = cols.split(/[,，]/)
        .map( i => parseInt(i))
        .filter( i => !isNaN(i) && 0<= i && excelObject.column.length > i);
    if(colsArray.length === 0){
        res.json({"errorMessage":"有效列为空"});
        return ;
    }
    excelObject.cols = colsArray;
}


function dateFormat(excelObject){

    let column = excelObject.cols.map( ci => excelObject.column[ci]);
    excelProcess.excelDataByColumn(excelObject,column);
    excelObject.column = column;
    return excelObject;
}

module.exports = router;
