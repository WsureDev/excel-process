const superagent = require('superagent');

const dataQueryUrl = 'https://dataquery.shanzhen.me/sz-data-query/dataquery/querydatabysql.htm';

const dataQuery = {

    query(dbname,querySql,szUserId,szUserToken){
        return superagent
            .post(dataQueryUrl)
            .send({dbname:dbname,querySql:querySql,szUserId:szUserId,szUserToken:szUserToken})
            .set('Content-Type','application/x-www-form-urlencoded')
            .set('Accept', 'application/json')
            .then( data => {
                return JSON.parse(data.text)
            })
    },

    async executeQuery(req,input,step,target){
        let out = []
        let header = [];
        let index = 0;
        let pageCount = Math.ceil(input.length/step) //计算页数
        for(let currentPage = 1; currentPage <=  pageCount; currentPage++){
            let end = currentPage * step> input.length ? input.length : currentPage * step;
            let arr = input.slice(index,end);
            index += arr.length;
            let insertSql = arr.map( v => "'"+ v[target] + "'").join(',')
            let newSql = req.querySql.replace('${insert}',insertSql)
            let resData = await this.query(req.dbname,newSql,req.szUserId,req.szUserToken);
            out = out.concat(resData.resultList);
            header = resData.colNameList;
        }
        return { column:header,rows:out };
    }

}



module.exports = dataQuery