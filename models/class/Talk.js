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
   * 获得帖子
   * @param {String} courseID 课程号
   * @return {Object} 帖子对象
   */
  async getTalk(courseID, userID, talkID) {
    try {
      var conn = await pool.getConnection();
      var ret;
      if (userID == undefined && talkID == undefined) {
        ret = await conn.query(
          "select talkID, userName, title, content, time \
            from talk left join user on talk.userID = user.userID \
            where courseID = ? ",
          courseID
        );
      } else if (talkID == undefined) {
        ret = await conn.query(
          "select talkID, userName, title, content, time \
              from talk left join user on talk.userID = user.userID \
              where courseID = ? and talk.userID = ?",
          [courseID, userID]
        );
      } else {
        ret = await conn.query(
          "select talkID, userName, title, content, time \
            from talk left join user on talk.userID = user.userID \
            where talk.talkID = ?",
          talkID
        );
      }
      return ret[0];
    } catch (err) {
      console.log(err);
      return 0;
    } finally {
      conn.release();
    }
  }

  /**
   * 获取评论
   * @param {String} courseID 课程号
   * @param {String} talkID 帖子号
   */
  async getComment(courseID, talkID) {
    try {
      var conn = await pool.getConnection();
      var ret = await conn.query(
        "select * from comment left join user on comment.userID = user.userID \
        where courseID = ? and talkID = ?",
        [courseID, talkID]
      );
      return ret[0];
    } catch (err) {
      console.log(err);
      return 0;
    } finally {
      conn.release();
    }
  }

  /**
   * 增加评论
   * @param {String} courseID
   * @param {String} talkID
   * @param {String} userID
   * @param {String} content
   * @return {int} 如果成功返回1，出错则返回0
   */
  async addComment(courseID, talkID, userID, content) {
    try {
      var conn = await pool.getConnection();
      await conn.query(
        "insert into comment(courseID, talkID, userID, content, time) \
        values (?,?,?,?,CURRENT_TIMESTAMP)",
        [courseID, talkID, userID, content]
      );
      return 1;
    } catch (err) {
      console.log(err);
      return 0;
    } finally {
      conn.release();
    }
  }
}
module.exports = Talk;
