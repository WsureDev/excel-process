
exports.utils = {
    isBlank(str){
        return str === undefined || str === null || str === ''
    },
    colsStr(length,separator){
        return this.cols(length).join(separator)
    },
    cols(length){
        return [...Array(length).keys()];
    },
    replace(text,regex,replacer,flag){
        return String(text).toString().replace(new RegExp(regex,flag),replacer);
    },
    omit:(prop, { [prop]: _, ...rest }) => rest
}
