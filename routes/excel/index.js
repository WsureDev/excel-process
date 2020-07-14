const express = require('express');
const router = express.Router();
const upload = require('../../public/config/uploader');
const excelReader = require('../../utils/excel-reader');
const excelExport = require('../../utils/excel-export');

/* GET users listing. */
router.all('/upload',upload.single('file'),async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    let cols = req.body.cols;
    let excelObject = {};
    if(cols === undefined || cols === null || cols === ''){
        res.json({"errorMessage":"列为空"});
        return ;
    }
    let sheet = parseInt(req.body.sheet);
    if(isNaN(sheet) || sheet<0){
        res.json({"errorMessage":"sheet未选择"});
        return ;
    }
    let result = await excelReader.read(req,res,next);
    if(sheet > result.length-1){
        res.json({"errorMessage":"sheet超限"});
        return ;
    }

    excelObject.sheet = sheet;
    excelObject.column = result[sheet].column;
    excelObject.data = result[sheet].data;
    excelObject.cols = cols.splice(/[,，]/);

    res.json(excelObject);
});

module.exports = router;
