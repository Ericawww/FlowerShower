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
   *  @param {String} datas.courseID
   *  @param {String} datas.time
   *  @param {String} datas.content
   */
  async updataNotice(datas) {}
}

module.exports = Notice;
