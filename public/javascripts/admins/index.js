var importDatas = [];
var userLists = [];
var selector = {
    userType: '3',
    gender: '2',
    userName: '',
    email: '',
    phoneNumber: ''
}
var userSelectorList = ['.user-student', '.user-teacher', '.user-admin', '.user-all'];
var genderSelectorList = ['.gender-female', '.gender-male', '.gender-all'];
var currentUserInfo = {};

$(() => {
    $('.import.modal').modal({
        closable: false, onHidden: function () {
            clearFile();
        }
    });
    $('.preview.modal').modal({ allowMultiple: true, closable: false });
    $('.preview.modal').modal('attach events', '.import.modal .primary.button');
    $("#importUserBtn").click(() => {
        $('.import.modal').modal('show');
    });
    $("#deleteUserBtn").click(() => {
        var params = [];
        for (let i = 0; i < userLists.length; i++) {
            if (userLists[i].checked) {
                params.push(userLists[i].userID);
            }
        }
        $(".delete.modal").find("strong").text(params.length);
        //console.log(params);
        $('.delete.modal').modal('show');
    });
    getUsers();
});

$("#selectUserBtn").click(() => {
    $('.ui.sidebar').sidebar('toggle');
});

$(".delete.modal .approve").click(() => {
    var params = [];
    for (let i = 0; i < userLists.length; i++) {
        if (userLists[i].checked) {
            params.push(userLists[i].userID);
        }
    }
    if (params.length == 0) {
        alert("请先选择要删除的用户！");
        return;
    }
    $.ajax({
        dataType: "json",
        type: "post",
        url: "/admin/deleteUsers",
        traditional: true,
        data: { params: params },
        success: (data) => {
            if (data.status == 1) {
                alert("删除成功!");
                //window.location.reload();
                getUsers();
            } else {
                alert(data.msg);
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
});

$('.import.modal .positive.button').click(() => {
    var file = $("input[type='file']").val();
    if (file && file != "") {
        $.ajax({
            dataType: "json",
            type: "post",
            url: "/admin/importUsers",
            traditional: true,
            data: { params: JSON.stringify(importDatas) },
            success: (data) => {
                if (data.status == 1) {
                    alert("导入成功!");
                    //window.location.reload();
                    getUsers();
                } else {
                    alert(data.msg);
                }
            },
            error: (err) => {
                alert('与服务器连接异常，请稍后再试!');
            }
        });
    } else {
        alert("请先选择一个文件！");
    }
});

$('.user-info.modal .positive.button').click(() => {
    console.log(currentUserInfo);
    $.ajax({
        dataType: "json",
        type: "post",
        url: "/admin/updateUser",
        data: currentUserInfo,
        success: (data) => {
            if (data.status == 1) {
                alert("修改成功!");
                //window.location.reload();
                getUsers();
            } else {
                alert(data.msg);
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
});

$('.import.modal .primary.button').click(() => {
    var table = $(".preview.table").find("tbody");
    $(table).html("");
    for (let i = 0; i < importDatas.length; i++) {
        var { userID, userName, userPwd, email, userType } = importDatas[i];
        var previewTemplate = `<tr><td>${userID}</td>
            <td>${userName}</td>
            <td>${userPwd}</td>
            <td>${email}</td>
            <td>${userType}</td>
          </tr>`;
        $(table).append(previewTemplate);
    }
});

$(".excel-file").change((e) => {
    var files = e.target.files;
    if (!checkFileType(files[0].name, '.xlsx')) {
        alert("文件格式不正确，请重新选择!");
        clearFile();
        return;
    }
    var fileReader = new FileReader();
    fileReader.onload = (ev) => {
        try {
            importDatas = ev.target.result,
                workbook = XLSX.read(importDatas, {
                    type: 'binary'
                }), // 以二进制流方式读取得到整份excel表格对象
                importDatas = []; // 存储获取到的数据
        } catch (e) {
            console.log(e);
            return;
        }
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
                importDatas = importDatas.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                break; // 如果只取第一张表，就取消注释这行
            }
        }
        //console.log(importDatas);
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);
});

var setSelector = (column, param) => {
    if (column == 'userType') {
        if (param != selector.userType) {
            $(userSelectorList[selector.userType]).removeClass("active");
            $(userSelectorList[param]).addClass("active");
            selector.userType = param;
        }
    } else if (column == 'gender') {
        if (param != selector.gender) {
            $(genderSelectorList[selector.gender]).removeClass("active");
            $(genderSelectorList[param]).addClass("active");
            selector.gender = param;
        }
    } else if (column == 'userName') {
        selector.userName = $(param).val();
    } else if (column == 'email') {
        selector.email = $(param).val();
    } else if (column == 'phoneNumber') {
        selector.phoneNumber = $(param).val();
    }
    //console.log(selector);
    getUsers();
}

var getUsers = () => {
    $.ajax({
        dataType: "json",
        type: "post",
        url: "/admin/getUsers",
        data: selector,
        success: (data) => {
            if (data.status == 1) {
                userLists = data.users;
                setUserList();
            } else {
                alert('用户数据加载失败！');
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
}

var setUserList = () => {
    var table = $(".user-table").find("tbody");
    $(table).html("");
    for (let i = 0; i < userLists.length; i++) {
        userLists[i].checked = false;
        var { userID, userName, email, phoneNumber, birth, gender, userType } = userLists[i];
        var userListTeplate = `<tr>
            <td class="collapsing">
              <div class="ui fitted slider checkbox">
                <input type="checkbox" onchange="setChecked(${i})"> <label></label>
              </div>
            </td>
            <td>${userID}</td>
            <td>${userName}</td>
            <td>${email}</td>
            <td>${phoneNumber == null ? '-' : phoneNumber}</td>
            <td>${birth == null ? '-' : new Date(birth).format("yyyy-MM-dd")}</td>
            <td>${gender == null ? '-' : gender}</td>
            <td>${userType}</td>
            <td>
              <i class="edit outline icon pointer" onclick="showUserModal(${i})"></i>
            </td>
          </tr>`;
        $(table).append(userListTeplate);
    }
}

var showUserModal = (index) => {
    var { userID, userName, email, phoneNumber, birth, gender, userType } = userLists[index];
    var { ...cloneObj } = userLists[index];  //拷贝对象
    currentUserInfo = cloneObj;
    var template = `<form class="ui form">
        <div class="field">
          <label>UserID： ${userID}</label>
        </div>
        <div class="field">
          <label>UserName</label>
          <input type="text" name="userName" value="${userName}" onchange="currentUserInfo.userName = $(this).val()">
        </div>
        <div class="field">
          <label>Email</label>
          <input type="text" name="email" value="${email}" onchange="currentUserInfo.email = $(this).val()">
        </div>
        <div class="field">
          <label>PhoneNumber</label>
          <input type="text" name="phoneNumber" value="${phoneNumber == null ? '' : phoneNumber}"  onchange="currentUserInfo.phoneNumber = $(this).val()">
        </div>
        <div class="field">
          <label>Birth</label>
          <input type="date" name="birth" value="${birth == null ? '' : new Date(birth).format("yyyy-MM-dd")}"  onchange="currentUserInfo.birth = $(this).val()" />
        </div>
        <div class="inline fields">
          <label>Gender</label>
          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" name="gender" value="1" ${gender == 1 ? "checked = ''" : ""}  tabindex="0" class="hidden" onchange="currentUserInfo.gender = $(this).val()">
              <label>Male</label>
            </div>
          </div>
          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" name="gender" value="0" ${gender == 0 ? "checked = ''" : ""} tabindex="0" class="hidden" onchange="currentUserInfo.gender = $(this).val()">
              <label>Female</label>
            </div>
          </div>
        </div>
        <div class="inline fields">
          <label>UserType</label>
          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" name="userType" value="0" ${userType == 0 ? "checked = ''" : ""} tabindex="0" class="hidden" onchange="currentUserInfo.userType = $(this).val()">
              <label>Student</label>
            </div>
          </div>
          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" name="userType" value="1" ${userType == 1 ? "checked = ''" : ""} tabindex="0" class="hidden" onchange="currentUserInfo.userType = $(this).val()">
              <label>Teacher</label>
            </div>
          </div>
          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" name="userType" value="2" ${userType == 2 ? "checked = ''" : ""} tabindex="0" class="hidden" onchange="currentUserInfo.userType = $(this).val()">
              <label>Admin</label>
            </div>
          </div>
        </div>
      </form>`;
    $(".modal.user-info").find(".content").html(template);
    $('.ui.radio.checkbox').checkbox();
    $(".modal.user-info").modal("show");
}

var setChecked = (index) => {
    userLists[index].checked = !userLists[index].checked;
}

var clearFile = () => {
    $(".preview.table").find("tbody").html("");
    $(".ui.excel-file").val("");
    importDatas = new Array();
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}