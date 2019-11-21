/**
 * @Note: Use for unit test
 */
var User = require('./class/User');

var test = async () => {
    var user = new User();
    var ret = await user.login("3170103456@zju.edu.cn", "123");
    console.log(ret);
}

test();