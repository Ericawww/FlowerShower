/**
 * @Note: Use for unit test
 */
var User = require('./class/User');

var test = async () => {
    var user = new User();
    //var ret = await user.login("3170103456@zju.edu.cn", "123");
    var ret = await user.regist({
        email: '3170103456@zju.edu.cn',
        userName: '应承峻',
        userPwd: '123456',
        phoneNumber: '17326084929'
    });
    console.log(ret);
    
}

test();