var assistants = [];
var current = {};
const PRIVILEGE_MATERIAL = 1;
const PRIVILEGE_HOMEWORK = 2;
const PRIVILEGE_GRADE = 4;
const PRIVILEGE_NOTICE = 8;

$(() => {
    getAssistants();
});

var showTAModal = (row) => {
    var title;
    if (row >= 0) {
        current = JSON.parse(JSON.stringify(assistants[row]));
        title = "修改助教权限";
    } else {
        current = {
            userID: '',
            privilege: parsePrivilege(0)
        };
        title = "添加助教";
    }
    $("#add-TA-modal").html(
     `<i class="close icon"></i>
      <div class="header">${title}</div>
      <div class="content">
        <div class="ui form">
          <b style="margin-right: 15px;">助教ID</b>
          <div class="ui input" >
            <input type="text" value='${current.userID}' ${row >= 0 ? 'disabled' : "onchange='current.userID = $(this).val()'"}>
          </div>
          <table class="ui compact celled definition table">
            <thead class="full-width">
              <tr>
                <th style="width: 200px;text-align: center;">选择权限</th>
                <th style="text-align: center;">权限名称</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="collapsing">
                  <div class="ui checkbox" style="margin-left: 80px;">
                    <input type="checkbox" name="privilege-setup" ${current.privilege.PRIVILEGE_MATERIAL ? 'checked' : ''} onchange='current.privilege.PRIVILEGE_MATERIAL = !current.privilege.PRIVILEGE_MATERIAL'>
                    <label></label>
                  </div>
                </td>
                <td style="text-align: center;">上传资料</td>
              </tr>
              <tr>
                <td class="collapsing">
                  <div class="ui checkbox" style="margin-left: 80px;">
                    <input type="checkbox" name="privilege-setup" ${current.privilege.PRIVILEGE_HOMEWORK ? 'checked' : ''} onchange='current.privilege.PRIVILEGE_HOMEWORK = !current.privilege.PRIVILEGE_HOMEWORK'>
                    <label></label>
                  </div>
                </td>
                <td style="text-align: center;">作业管理</td>
              </tr>
              <tr>
                <td class="collapsing">
                  <div class="ui checkbox" style="margin-left: 80px;">
                    <input type="checkbox" name="privilege-setup" ${current.privilege.PRIVILEGE_GRADE ? 'checked' : ''} onchange='current.privilege.PRIVILEGE_GRADE = !current.privilege.PRIVILEGE_GRADE'>
                    <label></label>
                  </div>
                </td>
                <td style="text-align: center;">班级成绩管理</td>
              </tr>
              <tr>
                <td class="collapsing">
                  <div class="ui checkbox" style="margin-left: 80px;">
                    <input type="checkbox" name="privilege-setup" ${current.privilege.PRIVILEGE_NOTICE ? 'checked' : ''} onchange='current.privilege.PRIVILEGE_NOTICE = !current.privilege.PRIVILEGE_NOTICE'>
                    <label></label>
                  </div>
                </td>
                <td style="text-align: center;">课程通知管理</td>
              </tr>
            </tbody>
            <tfoot class="full-width">
            </tfoot>
          </table>
        </div>
      </div>
      <div class="actions">
        <div class="ui red deny button">取消</div>
        <div class="ui green button" onclick="submitAssistant(${row})"}>提交</div>
      </div>`);
    $('#add-TA-modal').modal('show');
}

var getAssistants = () => {
    $.ajax({
        dataType: "json",
        type: "get",
        url: "./assistant/get",
        data: {},
        success: (data) => {
            if (data.status == 1) {
                assistants = data.assistants;
                renderTable();
            } else {
                alert('获取助教信息失败！');
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
}

var renderTable = () => {
    $("#ass-tb-body").html();
    for (let i = 0; i < assistants.length; i++) {
        assistants[i].privilege = parsePrivilege(assistants[i].privilege);
        var dataTemplate = `<tr>
            <td style="text-align: center;">${assistants[i].userID}</td>
            <td style="text-align: center;">${assistants[i].userName}</td>
            <td style="text-align: center;">${stringfyPrivilege(assistants[i].privilege)}</td>
            <td style="text-align: center;"><a href="javascript:showTAModal(${i})"><i class="edit icon"></i></a></td>
            <td style="text-align: center;"><a href="javascript:removeAssistant(${i})"><i class="trash alternate outline icon"></i></a></td>
        </tr>`;
        $("#ass-tb-body").append(dataTemplate);
    }
}

var removeAssistant = (row) => {
    if (confirm("确定删除该助教吗？")) {
        $.ajax({
            dataType: "json",
            type: "post",
            url: "./assistant/delete",
            data: {
                userID: assistants[row].userID
            },
            success: (data) => {
                if (data.status == 1) {
                    alert("删除成功！");
                    window.location.reload();
                } else {
                    alert('删除失败！' + data.msg);
                }
            },
            error: (err) => {
                alert('与服务器连接异常，请稍后再试!');
            }
        });
    }
}

var submitAssistant = (row) => {
    let reqPath = row >= 0 ? "./assistant/update" : "./assistant/insert";
    //console.log(current);
    $.ajax({
        dataType: "json",
        type: "post",
        url: reqPath,
        data: current,
        success: (data) => {
            if (data.status == 1) {
                alert("提交成功！");
                window.location.reload();
            } else {
                alert('提交失败！' + data.msg);
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
}

var parsePrivilege = (v) => {
    v = parseInt(v);
    return {
        PRIVILEGE_MATERIAL: (((v & PRIVILEGE_MATERIAL) > 0) ? true: false),
        PRIVILEGE_HOMEWORK: (((v & PRIVILEGE_HOMEWORK) > 0) ? true : false),
        PRIVILEGE_GRADE: (((v & PRIVILEGE_GRADE) > 0) ? true : false),
        PRIVILEGE_NOTICE: (((v & PRIVILEGE_NOTICE) > 0) ? true : false)
    }
}

var stringfyPrivilege = (priv) => {
    var str = "";
    if (priv.PRIVILEGE_MATERIAL) str += "上传资料 ";
    if (priv.PRIVILEGE_HOMEWORK) str += "作业管理 ";
    if (priv.PRIVILEGE_GRADE) str += "班级成绩管理 ";
    if (priv.PRIVILEGE_NOTICE) str += "课程通知管理 ";
    return str;
}

