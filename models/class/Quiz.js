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