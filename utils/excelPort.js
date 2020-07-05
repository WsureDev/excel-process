const excelPort = require('excel-export');
const fs = require('fs')
exports.write = function(req, res, next){
    const datas = req.datas;
    const conf = {};
    const filename = req.name;  //只支持字母和数字命名
    const phoneIndex = req.phoneIndex;

    conf.cols = [
        {caption:'公司名称', type:'string', width:30},
        {caption:'法定代表人', type:'string', width:30},
        {caption:'注册资本', type:'string', width:30},
        {caption:'所属行业', type:'string', width:40},
        {caption:'经营范围', type:'string', width:100},
        {caption:'联系电话（工商信息，每行首条为最新信息）', type:'string', width:120}
    ];


    const array = [];
    for(let i = 1;i<datas.length;i++){
        let phone = datas[i][phoneIndex];
        if(phone){
            let numbers = phone.toString().split(/\s+/);
            datas[i][phoneIndex] = numbers.filter( num => /^1\d{10}$/.test(num)).slice(0,2).join(' ');
        }
        array.push(datas[i])
    }


    conf.rows = array;
    const result = excelPort.execute(conf);

    const random = Math.floor(Math.random() * 10000);

    const uploadDir = 'exportExcel/';
    const filePath = uploadDir + filename + '_' + random + ".xlsx";

    fs.writeFile(filePath, result, 'binary',function(err){
        if(err){
            console.log(err);
        }
    });
}
