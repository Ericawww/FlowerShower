var pool = require("../mysql/ConnPool");

class Talk {
  constructor() {}

  /**
   * 用户发表帖子功能
   * @param {String} userID 用户账号
   * @param {String} title 标题
   * @param {String} content 内容
   * @return {int} 如果成功返回1，出错则返回0
   */
  async writeTalk(courseID, userID, title, content) {
    try {
      var conn = await pool.getConnection();
      console.log("插入");
      await conn.query(
        "insert into talk(courseID, userID, title, content, time) values(?,?,?,?,CURRENT_TIMESTAMP)",
        [courseID, userID, title, content]
      );
      return 1;
    } catch (err) {
      console.log(err);
      return 0;
    } finally {
      conn.release();
    }
  }

  /**
   * 获得通知
   * @param {String} courseID 课程号
   * @return {Object} 公告对象
   */
  async getTalk(courseID) {
    try {
      var conn = await pool.getConnection();
      var ret = await conn.query(
        "select * from talk where courseID = ?",
        courseID
      );
      return ret[0];
    } catch (err) {
      console.log(err);
      return 0;
    } finally {
      conn.release();
    }
  }
}

module.exports = Talk;
