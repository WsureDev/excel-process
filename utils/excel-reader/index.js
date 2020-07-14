const xlsx = require('xlsx');

exports.read = function(req) {
    return new Promise((resolve, reject) => {
        if(req.file === undefined){
            reject('未上传文件')
        }

        const path = req.file.path.toString();
        // 解析excel文件
        const workbook = xlsx.read(path, { type: 'file' });
        let sheets = [];
        console.log(workbook.SheetNames);
        workbook.SheetNames.forEach( name =>{
            let sheetMap = {};
            let data = xlsx.utils.sheet_to_json(workbook.Sheets[name]);
            sheetMap['column'] = data === undefined || data === null || data.length === 0 ? [] : Object.keys(data[0]);
            sheetMap['data'] = data;
            sheets.push(sheetMap);
        })
        resolve(sheets);
    })

};
