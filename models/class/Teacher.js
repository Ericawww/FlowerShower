var pool = require('../mysql/ConnPool');
var Assistant = require('../class/Assistant');

class Teacher extends Assistant {

    /**
     * 修改教师主页
     * 
     * @param {Object} datas  数据对象
     *   @param {String} datas.teacherID 教师ID
     *   @param {String} datas.position 职称
     *   @param {String} datas.profile 简介
     *   @param {String} datas.patent 专利
     *   @param {String} datas.course 教学课程
     *   @param {String} datas.papers 发表论文
     * @return {int} 修改成功返回1 否则返回0
     */
    async updateHomePage(datas) {
        try {
            var params = [datas.position, datas.profile, datas.patent, datas.course, datas.papers, datas.teacherID];
            var conn = await pool.getConnection();
            await conn.query("update teacher_info set position = ?, profile = ?, patent = ?, course = ?, papers = ? where teacherID = ?", params);
            return 1;
        }
        catch (err) {
            console.log(err);
            return 0;
        }
        finally {
            conn.release();
        }
    }

    /**
     * 获取教师主页
     * 
     * @param {String} teacherID 教师ID
     * @return {Object} 教师主页对象
     */
    async getHomePage(teacherID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from teacher_info where teacherID = ?", [teacherID]);
            if (ret[0].length == 0) {  //对应条目不存在则插入
                await conn.query("insert into teacher_info(teacherID) values(?)", [teacherID]);
                return new Object();
            }
            else {  //存在条目直接返回
                return ret[0][0];
            }
        }
        catch (err) {
            console.log(err);
            return null;
        }
        finally {
            conn.release();
        }
    }

}

module.exports = Teacher;