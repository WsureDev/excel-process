const xl = require('node-xlrd');

exports.read = function(req, res, next){
    return new Promise((resolve, reject) => {
        const name = 'excel1';
        const phoneIndex = 5;
        const path = `excelIn/${name}.xls`;
        let dataArray = [];
        xl.open(path, function(err,bk){
            if(err) {console.log(err.name, err.message); return;}

            const shtCount = bk.sheet.count;
            for(let sIdx = 0; sIdx < shtCount; sIdx++ ){
                console.log('sheet "%d" ', sIdx);
                console.log('  check loaded : %s', bk.sheet.loaded(sIdx) );
                const sht = bk.sheets[sIdx],
                    rCount = sht.row.count,
                    cCount = sht.column.count;
                console.log('  name = %s; index = %d; rowCount = %d; columnCount = %d', sht.name, sIdx, rCount, cCount);
                for(let rIdx = 0; rIdx < rCount; rIdx++){    // rIdx：行数；cIdx：列数
                    const data = [];
                    const numbers = [];
                    for(let cIdx = 0; cIdx < cCount; cIdx++){
                        if(cIdx<phoneIndex){
                            try{
                                data[cIdx] = sht.cell(rIdx,cIdx);
                                console.log('  cell : row = %d, col = %d, value = "%s"', rIdx, cIdx, sht.cell(rIdx,cIdx));
                            }catch(e){
                                console.log(e.message);
                            }
                        }else {
                            numbers.push(sht.cell(rIdx,cIdx).toString())
                        }
                    }
                    data[phoneIndex] = numbers.join(' ')
                    dataArray[rIdx] = data;
                }
            }

            req.datas = dataArray;
            req.phoneIndex = phoneIndex;
            req.name = name;
            resolve(req);
        });
    })

};
