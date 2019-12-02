/**
 * @Note: Use for unit test
 */
var User = require('./class/User');
var Admin = require('./class/Admin');
var utils = require('./method/utils')

var test = async () => {
    try {
        // var ret = await Admin.prototype.getUsers({
        //     userType: 1,
        //     email: 'qq'
        // });
        // var ret = await Admin.prototype.importUsers([{
        //     userID: '10086',
        //     userName: '导入测试',
        //     userPwd: '123',
        //     email: 'xyzwbc@qq.com',
        //     userType: 0
        // }]);
        //var ret = await Admin.prototype.deleteUsers(['10086']);
        console.log(ret);
    } catch (err) {
        console.log(err);
    }
}

test();