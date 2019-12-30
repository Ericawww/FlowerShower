var pool = require('../mysql/ConnPool');
var config = require('../statics/config');
var User = require('../class/User');

/**
 * 助教权限约定
    上传资料  1
    作业管理   2
    班级成绩管理 4
    课程通知管理  8
 */

var PRIVILEGE_MATERIAL = config.ASSISTANT_PRIVILEGE_MATERIAL;
var PRIVILEGE_HOMEWORK = config.ASSISTANT_PRIVILEGE_HOMEWORK;
var PRIVILEGE_GRADE = config.ASSISTANT_PRIVILEGE_GRADE;
var PRIVILEGE_NOTICE = config.ASSISTANT_PRIVILEGE_NOTICE;

class Assistant extends User {

    checkPrivilegeMaterial(priv) {
        try {
            if (priv & PRIVILEGE_MATERIAL) return true;
            else return false;
        } catch (err) {
            return false;
        }
    }

    checkPrivilegeHomework(priv) {
        try {
            if (priv & PRIVILEGE_HOMEWORK) return true;
            else return false;
        } catch (err) {
            return false;
        }
    }

    checkPrivilegeGrade(priv) {
        try {
            if (priv & PRIVILEGE_GRADE) return true;
            else return false;
        } catch (err) {
            return false;
        }
    }

    checkPrivilegeNotice(priv) {
        try {
            if (priv & PRIVILEGE_NOTICE) return true;
            else return false;
        } catch (err) {
            return false;
        }
    }

    async getAssistants(classID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select userID, userName, classID, privilege from assistant natural join user where classID = ?", [classID]);
            return ret[0];
        } catch (err) {
            return null;
        } finally {
            conn.release();
        }
    }

    async insertAssistant(classID, userID, priv) {
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into assistant(userID, classID, privilege) values(?, ?, ?)", [userID, classID, priv]);
            return null;
        } catch (err) {
            return err.message;
        } finally {
            conn.release();
        }
    }

    async deleteAssistant(classID, userID) {
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from assistant where classID = ? and userID = ?", [classID, userID]);
            return null;
        } catch (err) {
            return err.message;
        } finally {
            conn.release();
        }
    }

    async updateAssistantPrivilege(classID, userID, priv) {
        try {
            var conn = await pool.getConnection();
            await conn.query("update assistant set privilege = ? where classID = ? and userID = ?", [priv, classID, userID]);
            return null;
        } catch (err) {
            return err.message;
        } finally {
            conn.release();
        }
    }

    parsePrivilege(obj) {
        var priv = 0;
        if (parseBoolean(obj.PRIVILEGE_MATERIAL) == true) priv += PRIVILEGE_MATERIAL;
        if (parseBoolean(obj.PRIVILEGE_GRADE) == true) priv += PRIVILEGE_GRADE;
        if (parseBoolean(obj.PRIVILEGE_HOMEWORK) == true) priv += PRIVILEGE_HOMEWORK;
        if (parseBoolean(obj.PRIVILEGE_NOTICE) == true) priv += PRIVILEGE_NOTICE;
        return priv;
    }

}

var parseBoolean = (bool) => {
    if (bool == "true" || bool == true) return true;
    else if (bool == "false" || bool == false) return false;
    return null;
};

module.exports = Assistant;