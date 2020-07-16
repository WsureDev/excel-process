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
    let excelObject = {} , options = {};

    try {
        await createExcelObject(req,res,excelObject,options);
        excelProcess.select(excelObject,options);
    }catch (e) {
        res.json({error:e.message});
        return ;
    }
    res.json();
});

router.all('/download',upload.single('file'),async (req, res, next) => {
    let file = req.file;
    let excelObject = {};
    try {
        await strategyExecute(req,res,excelObject);
    }catch (e) {
        res.json({"error":e.message});
        return ;
    }
    let result = excelExport.write(excelObject);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent(file.originalname.substring(0,file.originalname.lastIndexOf('.')))+".xlsx");
    res.end(result, 'binary');
});

router.all('/preview',upload.single('file'),async (req, res, next) => {
    let excelObject = {} ,error = null,body = req.body;
    try {
        await strategyExecute(req,res,excelObject);
    }catch (e) {
        error = e.message;
        res.render('excel-preview',{
            title:'excel-preview',
            excelObject:excelObject,
            error:error,
            body:body
        })
        return ;
    }
    body.nextCols = utils.colsStr(excelObject.column.length,',');
    excelObject.data = excelObject.data.slice(0,10);
    res.render('excel-preview',{
        title:'excel-preview',
        excelObject:excelObject,
        error:error,
        body:body
    })
});

async function strategyExecute(req,res,excelObject){
    let strategy = req.body.strategy;
    let options = {};
    await createExcelObject(req,res,excelObject,options);
    excelProcess.select(excelObject,options);
    if(!utils.isBlank(strategy)){
        let strategyList = JSON.parse(strategy);
        strategyList.forEach( s => {
            excelProcess[s.name](excelObject,s.options);
        })
    }
}


async function createExcelObject(req,res,excelObject,options) {
    let cols = req.body.cols,colsArray = [];

    if(cols === undefined || cols === null || cols === ''){
        throw new Error("列为空");
    }

    let sheet = parseInt(req.body.sheet);
    if(isNaN(sheet) || sheet<0){
        throw new Error("sheet未选择");
    }
    let result = await excelReader.read(req);
    if(sheet > result.length-1){
        throw new Error("sheet超限");
    }

    excelObject.sheet = sheet;
    excelObject.column = result[sheet].column;
    excelObject.data = result[sheet].data;

    colsArray = cols.split(/[,，]/)
        .map( i => parseInt(i))
        .filter( i => !isNaN(i) && 0<= i && excelObject.column.length > i);
    if(colsArray.length === 0){
        throw new Error("有效列为空");
    }
    options.cols = colsArray;
}


module.exports = router;
