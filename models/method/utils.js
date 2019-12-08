var exported = {};
var fs = require("fs"); //文件系统操作

/**
 * 生成随机字符串
 * 
 * @param {int} len 字符串长度
 */
exported.randomString = (len) => {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

/**
 * 删除文件
 * 
 * @param {string} 文件绝对路径
 * @return {boolean | Exception} 成功返回true，否则抛出异常
 * @apiNote 该函数被封装成Promise对象，可以方便地通过await进行调用
 */
exported.removeFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, function (err) {
            if (err) reject(err);
            else resolve(true);
        });
    });
};

/**
 * 日期格式化
 * 
 * @param {Object} 日期，可以是对象或者字符串
 * @param {string} 格式，eg: yyyy-MM-dd HH:mm:ss
 * @return {string} 格式化字符串，如果出错则输出null
 */
exported.dateFormat = (date, fmt) => {
    if (date instanceof Date) {
        return date.Format(fmt);
    }
    else {
        try {
            return new Date(date).Format(fmt);
        }
        catch (err) {
            return null;
        }
    }
};

/**
 * 判断是否是yyyy-MM-dd格式的字符串
 * 
 * @param {*} mystring 日期字符串
 */
exported.isYMDDate = (mystring) => {
    var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
    var str = mystring;
    var arr = reg.exec(str);
    if (!reg.test(str) && RegExp.$2 <= 12 && RegExp.$3 <= 31) return false;
    return true;
};


Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


module.exports = exported;