const multer = require('multer');
const dest = process.cwd() + '/uploads';
const fs = require('fs');
const path = require('path');

let uploader = multer({
    dest:dest,
    storage:multer.diskStorage({
        destination: function (req, file, cb) {
            let basePath = dest+req.originalUrl;
            if (!fs.existsSync(basePath)) {
                fs.mkdirSync(basePath,{ recursive: true });
            }
            cb(null,basePath );    // 保存的路径，备注：需要自己创建
        },
        filename: function (req, file, cb) {
            // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
            cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
        }
    })
})

module.exports = uploader;
