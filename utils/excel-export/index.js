const index = require('excel-export');
exports.write = (excelObject) => {
    //excel对象
    const excel = {};
    //excel列列表
    let cols = excelObject.column;
    //生成excel列对象
    excel.cols = cols.map( c => {
        return {caption:c, type:'string', width:(c.length+1)*10} //列宽按字数*10
    });

    if(excelObject.rows) excel.rows = excelObject.rows;
    else {
        //excel内容 对象转二维数组
        excel.rows = excelObject.data.map(row => {
            let rowArr = [];
            cols.forEach( c => {
                //空的内容直接当成空白处理
                rowArr.push(row[c] === undefined ? '' : row[c]);
            })
            return rowArr;
        });
    }

    //  返回excel对象
    return index.execute(excel);

}
