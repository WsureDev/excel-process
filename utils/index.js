
exports.utils = {
    isBlank(str){
        return str === undefined || str === null || str === ''
    },
    colsStr(length,separator){
        return this.cols(length).join(separator)
    },
    cols(length){
        return [...Array(length).keys()];
    }
}
