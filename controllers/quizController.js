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