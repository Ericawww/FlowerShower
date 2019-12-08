var fs = require("fs");
var formidable = require("formidable");
var path = require("path");
var config = require("../statics/config");

module.exports = (req, name, dirName) => {
    return new Promise((resolve, reject) => {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = path.join(__dirname, "../../private", dirName);
        form.keepExtensions = true;
        form.maxFileSize = config.FILE_MAX_SIZE; //文件最大大小
        form.parse(req, (err, params, file) => {
            if (err) {
                reject(err.message);
                return;
            }
            if (file[name] == undefined || file[name].size <= 0) {
                if (file[name] != undefined) {
                    fs.unlink(file[name].path, (err) => {
                        reject("请选择上传的文件");
                        return;
                    });
                }
            } else {
                var num = file[name].path.lastIndexOf(".");
                var extension = file[name].path.substr(num).toLowerCase();
                if (!config.FILE_EXCLUDE_TYPE.includes(extension)) {  //文件扩展名不在黑名单内
                    var newName = (new Date()).getTime() + extension;  //更改文件名
                    fs.rename(file[name].path, form.uploadDir + "/" + newName, (err) => {
                        resolve({ newName: newName, originName: file[name].name });
                        return;
                    });
                } else {
                    fs.unlink(file[name].path, (err) => {
                        reject("禁止上传" + extension + "格式的文件！");
                        return;
                    });
                }
            }
        });
        form.on('field', function (name, value) {
            req.body[name] = value;  //这里提取的是键值对数据
        });
    });
};