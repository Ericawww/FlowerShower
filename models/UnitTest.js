/**
 * @Note: Use for unit test
 */
var User = require('./class/User');
var utils = require('./method/utils')

var test = async () => {
    var user = new User();
    // var ret = await user.login("3170103456@zju.edu.cn", "123");
    // var ret = await user.regist({
    //     email: '3170103456@zju.edu.cn',
    //     userName: '应承峻',
    //     userPwd: '123456',
    //     phoneNumber: '17326084929'
    // });
    // var ret = await utils.removeFile('../public/photos/1.txt');
    // var ret = await user.updateUserInfo({
    //     userID: '1111',
    //     userPwd: '123456',
    //     birth: '1999-07-22',
    //     userIntro: 'hahaha'
    // });
    try {

    } catch (err) {
        console.log(err);
    }
    console.log(ret);
    
}

test();