var User = require('./User');
var Quiz = require('./Quiz');
var pool = require('../mysql/ConnPool');
var test = async () => {
    var ret = await Quiz.prototype.getUserQuizStatus("1111", 5);
    console.log(ret);
};

test();

