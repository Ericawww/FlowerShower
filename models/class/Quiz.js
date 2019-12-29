var pool = require('../mysql/ConnPool');

class Quiz {

    async getProblemBank(courseNumber) {

    }

    async createProblem(problem) {
        let { problemID, courseNumber, description, choiceA, choiceB, choiceC, choiceD, answer, submitter } = problem;
    }

    async deleteProblem(problemID, courseNumber) {

    }

    async createQuiz(quizName, classID, startTime, closeTime) {

    }

    async deleteQuiz(classProjectID) {  //check isGroupWork = 3

    }

    async insertProblemToQuiz(classProjectID, problemID, score) {
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into project_problem(classProjectID, problemID, score) values (?, ?, ?)", [classProjectID, problemID, score]);
            return 1;
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

    async removeProblemFromQuiz(classProjectID, problemID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_project_score where classProjectID = ?", [classProjectID]);
            if (ret[0].length != 0) {
                return -1;
            }
            await conn.query("delete from project_problem where classProjectID = ? and problemID = ?", [classProjectID, problemID]);
            return 1;
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

    async getQuizProblems(classProjectID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from project_problem natural join problem_bank where classProjectID = ?", [classProjectID]);
            return ret[0];
        } catch (err) {
            console.log(err);
        } finally {
            conn.release();
        }
    }

    async submitQuiz(answers) {
        let { studentID, classProjectID, mark } = answers;
        //let commitTime = new Date();
        //'insert into .. values(CURRENT_TIMESTAMP)'
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("insert into class_project_score(classProjectID, studentID, commitTime, mark) values (?, ?, CURRENT_TIMESTAMP, ?)", [classProjectID, studentID, mark]);
            return 1;
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

    async getUserQuizStatus(studentID, classProjectID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_project_score where classProjectID = ? and studentID = ?", [classProjectID, studentID]);
            if (ret[0].length > 0) {
                return 1;
            } else {
                return -1;
            }
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

}

module.exports = Quiz;