var pool = require('../mysql/ConnPool');
var config = require('../statics/config');

class Quiz {

    /**
     * 获取某门课程对应的题库
     * 
     * @param {string} courseNumber 
     * @return 返回题库JSON数组，否则返回null
     */
    async getProblemBank(courseNumber) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from problem_bank where courseNumber = ?", [courseNumber]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 向题库中添加试题
     * 
     * @param {Object} problem 
     * @note answer应该在前端做好数值映射，选项非空判断也应该在前端完成
     * @return 正确插入返回null, 出现异常返回报错信息
     */
    async createProblem(problem) {
        let { problemID, courseNumber, description, choiceA, choiceB, choiceC, choiceD, answer, submitter } = problem;
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into problem_bank(courseNumber, description, choiceA, choiceB, choiceC, choiceD, answer, submitter) \
                values(?, ?, ?, ?, ?, ?, ?, ?)", [problemID, courseNumber, description, choiceA, choiceB, choiceC, choiceD, answer, submitter]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 删除试题
     * 
     * @param {int} problemID 
     * @param {string} courseNumber 
     * @return 正确插入返回null, 出现异常返回报错信息
     */
    async deleteProblem(problemID, courseNumber) {
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from problem_bank where problemID = ? and courseNumber = ?", [problemID, courseNumber]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 新建小测
     * 
     * @param {string} quizName
     * @param {string} classID 
     * @param {Date} startTime 
     * @param {Date} closeTime
     * @return 正确插入返回null, 出现异常返回报错信息
     */
    async createQuiz(quizName, classID, startTime, closeTime) {
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into class_project(projectName, classID, startTime, closeTime, isGroupWork) values (?, ?, ?, ?, ?)",
                [quizName, classID, startTime, closeTime, config.PROJECT_TYPE_QUIZ]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 删除小测
     * 
     * @param {int} classProjectID
     * @return 正确插入返回null, 出现异常返回报错信息
     */
    async deleteQuiz(classProjectID) {  //check isGroupWork = 3
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from class_project where classProjectID = ? and isGroupWork = ?", [classProjectID, config.PROJECT_TYPE_QUIZ]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    async insertProblemToQuiz(classProjectID, problemID, score) {

    }

    async removeProblemFromQuiz(classProjectID, problemID) {

    }

    async getQuizProblems(classProjectID) {

    }

    async submitQuiz(answers) {
        let { studentID, classProjectID, mark } = answers;
        //let commitTime = new Date();
        //'insert into .. values(CURRENT_TIMESTAMP)'
    }

    async getUserQuizStatus(studentID, classProjectID) {

    }

}

module.exports = Quiz;