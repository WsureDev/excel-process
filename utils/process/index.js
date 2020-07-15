const utils = require('../index').utils;

exports.processer = {
    //合并列
    /*
        测试数据 ：
        [{"name":"joinColumn","options":{"cols":[0,1],"separator":",","target":0}}]
     */
    joinColumn:function (excelObject,options) {
        let cols = options.cols; // 合并列的下标数组，如：[1,2,3]
        let separator = options.separator; //   合并的分割符，如：，
        let target = options.target;    //  合并位置 ，在cols 元素内，如：1
        let newColumn = excelObject.column.filter( (c,index) => !cols.includes(index) || index === target );
        excelObject.data.forEach(
            row => row[excelObject.column[target]] = cols.map(ci => row[excelObject.column[ci]]).join(separator)
        )
        this.excelDataByColumn(excelObject,newColumn);
        excelObject.column = newColumn;
    },
    //切割列
    /*
        测试数据
        [{"name":"joinColumn","options":{"cols":[0,1],"separator":",","target":0}},
        {"name":"splitColumn","options":{"max":3,"separator":",","target":0}}]
     */
    splitColumn:function (excelObject,options) {
        let max = options.max;
        let separator = utils.isBlank(options.separator) ? ',' : options.separator;
        let target = options.target;
        let addCols = utils.cols(max).map( (i) =>  `${excelObject.column[target]}_${i+1}`);
        let newColumn = excelObject.column.slice(0,target).concat(addCols).concat(excelObject.column.slice(target+1));
        excelObject.data = excelObject.data.map(row => {
            let splitData = row[excelObject.column[target]].split(new RegExp(separator));
            addCols.forEach( (col,index) => {
                row[col] = splitData[index];
            })
            return row;
        });
        excelObject.column = newColumn;
    },
    //增加行
    addRow:function (excelObject,options) {

    },
    //删除行
    delRow:function (excelObject,options) {

    },
    //去重
    /*
        测试数据 ：
        [{"name":"joinColumn","options":{"cols":[0,1],"separator":",","target":0}},
        {"name":"splitColumn","options":{"max":3,"separator":",","target":0}},
        {"name":"distinct","options":{"cols":[0,1,2],"deleteRow":true}}]
     */
    distinct:function (excelObject,options) {
        let { cols, deleteRow } = options; // 参与去重的列的下标数组，如：[1,2,3]
         // 是否删除行，如：true
        let set = [];
        let data = [];
        excelObject.data.forEach( row => {
            let noNew = true;
            cols.forEach( ci => {
                let key = excelObject.column[ci];
                if(set.includes(row[key])){
                    row[key] = '';
                } else {
                    set.push(row[key]);
                    noNew = false;
                }
            })
            if(!(deleteRow && noNew)){
                data.push(row);
            }
        })
        excelObject.data = data;
    },
    //过滤
    /*
        测试数据 ：
        [{"name":"joinColumn","options":{"cols":[0,1],"separator":",","target":0}},
        {"name":"splitColumn","options":{"max":3,"separator":",","target":0}},
        {"name":"distinct","options":{"cols":[0,1,2],"deleteRow":true}},
        {"name":"filter","options":{"cols":[0,1,2],"regex":"\\S"}}]
     */
    filter:function (excelObject,options) {
        let { cols, regex } = options;
        let data = [];
        excelObject.data.forEach( row => {
            let result = cols.map( ci => row[excelObject.column[ci]] )
                .filter( text => new RegExp(regex).test(utils.isBlank(text)? '' : text));
            if(result.length > 0){
                data.push(row);
            }
        })
        excelObject.data = data;
    },
    //替换
    /*
        测试数据 ：
        [{"name":"joinColumn","options":{"cols":[0,1],"separator":",","target":0}},
        {"name":"splitColumn","options":{"max":3,"separator":",","target":0}},
        {"name":"distinct","options":{"cols":[0,1,2],"deleteRow":true}},
        {"name":"filter","options":{"cols":[0,1,2],"regex":"\\S"}},
        {"name":"replace","options":{"cols":[0,1,2],"regex":"\\d","replacer":"AA"}}]
     */
    replace:function (excelObject,options) {
        let { cols, regex, replacer } = options;
        excelObject.data = excelObject.data.map( row => {
            cols.forEach( ci => {
                let key = row[excelObject.column[ci]];
                row[key] = row[key].toString().replace(new RegExp(regex),replacer);
            });
            return row;
        })
    },
    //根据行获取所有数据
    excelDataByColumn:function (excelObject,column) {
        excelObject.data = excelObject.data.map(row => {
            let newRow = {};
            column.forEach(key => {
                newRow[key] = row[key];
            });
            return newRow;
        });
    }


};
