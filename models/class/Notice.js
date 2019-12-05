var pool = require("../mysql/ConnPool");

class Notice {
  /**
   * 获得通知
   * @param {String} courseID 课程号
   * @return {Object} 通知对象
   */
  async getCourseNotice(courseID) {
    try {
      var conn = await pool.getConnection();
      var ret = await conn.query("select * from notice where courseID = ?", [
        courseID
      ]);
      return ret[0];
    } catch (err) {
      console.log(err);
    } finally {
      conn.release();
    }
  }

  /**
   * 添加通知
   * @param {Object} datas
   *  @param {String} datas.classID 课程号
   *  @param {String} datas.time 公告发布时间
   *  @param {String} datas.title 公告标题
   *  @param {String} datas.content 公告内容
   */
  async updataNotice(classID, title, content) {
    try {
      var conn = await pool.getConnection();
      var params = [classID, title, content];
      await conn.query(
        "insert into notice(courseID,time,title,content) \
        values (?,CURRENT_TIMESTAMP,?,?)",
        params
      );
      return 1;
    } catch (err) {
      console.log("发布公告失败");
      console.log(err);
      return 0;
    } finally {
      conn.release();
    }
  }
}

module.exports = Notice;
