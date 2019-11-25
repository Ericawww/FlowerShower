var exported = {};

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
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}


module.exports = exported;