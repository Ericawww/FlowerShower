var pool = require("../mysql/ConnPool");

class Classes {
  /**
   *
   * @param {string} classID 教学班ID
   * @param {Array} attr 附加属性, 取值可以是''
   * @return {Object} 结果集
   */
  async getClassDetail(classID, attr) {}

  async setClassDetail() {}

  async getClassMembers(classID) {}

  async importClassMembers(classID, students) {}

  async deleteClassMembers(classID, students) {}

  async getProjects(classID, conditions) {}

  async addProject(classID, proj) {}

  async deleteProject(classID) {}

  async updateProject(classID, proj) {}

  async submitProject(classID, proj) {}

  async getProjectStat(classProjectID, studentID) {}

  async updateProjectStat(classProjectID, studentID, stat) {}

  async getGroups() {}

  async createGroup() {}

  async deleteGroup() {}

  async insertStudentToGroup() {}

  async removeStudentFromGroup() {}
}

module.exports = Classes;
