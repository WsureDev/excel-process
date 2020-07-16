const utils = require('../index').utils;

exports.processer = {
    //合并列
    /*
        测试数据 ：
        [{"name":"join","options":{"cols":[0,1],"separator":",","target":0}}]
     */
    join:function (excelObject,options) {
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
        [{"name":"join","options":{"cols":[0,1],"separator":",","target":0}},
        {"name":"split","options":{"max":3,"separator":",","target":0}}]
     */
    split:function (excelObject,options) {
        let limit = options.limit;
        let separator = utils.isBlank(options.separator) ? ',' : options.separator;
        let regex = utils.isBlank(options.regex) ? ',' : options.regex;
        let target = options.target;
        let mode = utils.isBlank(options.mode) ? ',' : options.mode; // all , limit , spare
        let keep = utils.isBlank(options.keep) ? false : options.keep;
        let addCols = utils.cols(limit).map( (i) =>  `${excelObject.column[target]}_${i+1}`);
        let newColumn = excelObject.column.slice(0, keep ? (target+1) : target).concat(addCols).concat(excelObject.column.slice(target+1));
        excelObject.data = excelObject.data.map(row => {
            let splitData = row[excelObject.column[target]].split(new RegExp(regex));
            addCols.forEach( (col,index) => {
                if(index < addCols.length-1) {
                    row[col] = utils.isBlank(splitData[index]) ? '' : splitData[index];
                } else {
                    let lastAddCol = splitData.slice(index);
                    row[col] = lastAddCol.length === 0 ? '' : lastAddCol.join(separator);
                }
            })
            // row.delete(excelObject.column[target]);
            row = utils.omit(excelObject.column[target],row);
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
        [{"name":"join","options":{"cols":[0,1],"separator":",","target":0}},
        {"name":"split","options":{"max":3,"separator":",","target":0}},
        {"name":"distinct","options":{"cols":[0,1,2],"deleteRow":true}}]
     */
    distinct:function (excelObject,options) {
        let { cols, deleteRow } = options; // 参与去重的列的下标数组，如：[1,2,3]
         // 是否删除行，如：true
        let set = [];
        let data = [];
        excelObject.data.forEach( row => {
            let newRow = cols.map( ci => {
                let key = excelObject.column[ci];
                if(!set.includes(row[key])){
                    set.push(row[key]);
                    return row[key];
                } else {
                    return '';
                }
            }).filter( v => !utils.isBlank(v));
            if(newRow.length>0){
                cols.forEach( (ci,index) => {
                    let key = excelObject.column[ci];
                    row[key] = index < newRow.length ? newRow[index] : '';
                })
                data.push(row);
            }
        })
        excelObject.data = data;
    },
    //过滤
    /*
        测试数据 ：
        [{"name":"join","options":{"cols":[0,1],"separator":",","target":0}},
        {"name":"split","options":{"max":3,"separator":",","target":0}},
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
        [{"name":"join","options":{"cols":[0,1],"separator":",","target":0}},
        {"name":"split","options":{"max":3,"separator":",","target":0}},
        {"name":"distinct","options":{"cols":[0,1,2],"deleteRow":true}},
        {"name":"filter","options":{"cols":[0,1,2],"regex":"\\S"}},
        {"name":"replace","options":{"cols":[0,1,2],"regex":"\\d","replacer":"AA","flag":"g"}}]
     */
    replace:function (excelObject,options) {
        let { cols, regex, replacer,flag } = options;
        excelObject.data = excelObject.data.map( row => {
            cols.forEach( ci => {
                let key = excelObject.column[ci];
                row[key] = utils.replace(row[key],regex,replacer,flag);
            });
            return row;
        })
    },
    //选择列
    /*
        测试数据 ：

     */
    select:function (excelObject,options) {
        let cols = options.cols;
        let column = cols.map( ci => excelObject.column[ci]);
        this.excelDataByColumn(excelObject,column);
        excelObject.column = column;
    },
    //根据行获取所有数据
    excelDataByColumn:function (excelObject,column) {
        excelObject.data = excelObject.data.map(row => {
            let newRow = {};
            column.forEach(key => {
                newRow[key] = utils.isBlank(row[key]) ? '' : row[key];
            });
            return newRow;
        });
    }


};
