const index = require('excel-export');
const fs = require('fs')
exports.write = (excelObject) => {
    const excel = {};
    excel.rows = excelObject.data;
    const fileName = excelObject.fileName;  //只支持字母和数字命名
    let cols = excelObject.column;
    excel.cols = cols.map( c => {
        return {caption:c, type:'string', width:(c+1)*30}
    });


    // const array = [];
    // for(let i = 1;i<data.length;i++){
    //     let phone = data[i][phoneIndex];
    //     if(phone){
    //         let numbers = phone.toString().split(/\s+/);
    //         data[i][phoneIndex] = numbers.filter( num => /^1\d{10}$/.test(num)).slice(0,2).join(' ');
    //     }
    //     array.push(data[i])
    // }

    const result = index.execute(excel);

    const uploadDir = '../../uploads/excel/download/';
    const filePath = uploadDir + fileName + ".xlsx";

    fs.writeFile(filePath, result, 'binary',(err) => {
        if(err){
            console.log(err);
        }
    });
}
