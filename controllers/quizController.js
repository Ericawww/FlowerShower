var Quiz = require("../models/class/Quiz");
var Class = require("../models/class/Classes");

var checkCourseNumber = async (req, res) => {
    var courseNumber = await Class.prototype.getCourseNumberByClassID(req.params.classID);
    if (courseNumber == null) {
        res.send({ status: 0, msg: 'Invalid classID!' }).end();
        return null;
    }
    return courseNumber;
};

exports.getProblemBankPage = async (req, res) => {
    var courseNumber = await checkCourseNumber(req, res);
    if (courseNumber == null) return;
    var problems = await Quiz.prototype.getProblemBank(courseNumber);
    res.render('quizs/bank', { problems: problems });
};

exports.deleteProblem = async (req, res) => {
    var courseNumber = await checkCourseNumber(req, res);
    if (courseNumber == null) return;
    var msg = await Quiz.prototype.deleteProblem(req.body.problemID, courseNumber);
    if (msg) {
        res.send({ status: 0, msg: msg }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};

exports.createProblem = async (req, res) => {
    var courseNumber = await checkCourseNumber(req, res);
    if (courseNumber == null) return;
    var msg = await Quiz.prototype.createProblem(courseNumber, req.body, req.session.token.userID);
    if (msg) {
        res.send({ status: 0, msg: msg }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};

exports.getQuiz = async (req, res) => {
    var ret = await Quiz.prototype.getQuiz(req.params.classID);
    if (ret == null) {
        res.send({ status: 0, msg: '数据库异常，请稍后再试' }).end();
    } else {
        res.send({ status: 1, quizs: ret }).end();
    }
};

exports.insertProblemToQuiz = async (req, res) => {
    var msg = await Quiz.prototype.insertProblemToQuiz(req.body.quizID, req.body.problemID, req.body.score);
    if (msg) {
        res.send({ status: 0, msg: msg }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};

exports.removeProblemFromQuiz = async (req, res) => {
    var msg = await Quiz.prototype.removeProblemFromQuiz(req.body.classProjectID, req.body.problemID);
    if (msg) {
        res.send({ status: 0, msg: msg }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};


/**
 * 学生获得考试试题
 */
exports.getQuizProblems = async (req, res) => {
    var quizID = req.query.qids;
    var studentID = req.session.token.userID;
    var flag = await Quiz.prototype.getUserQuizStatus(studentID, quizID);
    var ret = await Quiz.prototype.getQuizProblems(quizID);
    var quizName = await Quiz.prototype.getQuizName(quizID);
    var data = {
        ret: ret,
        flag: flag,
        quizName: quizName
    };
    //console.log(data.ret.length);
    console.log(data);
    res.render('quizs/quiz', data);
};

/**
 * 提交测试
 */
exports.submitQuiz = async (req, res) => {
    var studentID = req.session.token.userID;
    var flag = req.body.flag;
    var ret;
    if (parseInt(flag) == 1) {
        ret = 0;
    } else {
        ret = await Quiz.prototype.submitQuiz({ studentID: studentID, classProjectID: req.body.quizID, mark: req.body.score });
    }
    if (ret == 1) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0 }).end();
    }
};