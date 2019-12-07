var flag = -1;

var showClassModal = (cl) => {
    try {
        if (cl) {
            $(".classID").prop("hidden", false);
            $("input[name='classID']").val(cl.classID);
            $("input[name='teacherID']").val(cl.teacherID);
            $("input[name='startTime']").val(cl.startTime);
            $("input[name='closeTime']").val(cl.closeTime);
            flag = 1;
        } else {
            $(".classID").prop("hidden", true);
            $("input[name='classID']").val("");
            $("input[name='teacherID']").val("");
            $("input[name='startTime']").val("");
            $("input[name='closeTime']").val("");
            flag = 0;
        }
        $('.ui.modal.classes').modal('show');
    } catch (err) {
        console.log(err);
    }
}

var createClass = () => {
    const msg = ["添加", "修改"];
    var data, url;
    if (flag == 0) {
        data = {
            teacherID: $("input[name='teacherID']").val(),
            startTime: $("input[name='startTime']").val(),
            closeTime: $("input[name='closeTime']").val(),
            courseNumber: courseNumber
        };
        url = "/admin/createClass";
    } else if (flag == 1) {
        data = {
            classID: $("input[name='classID']").val(),
            teacherID: $("input[name='teacherID']").val(),
            startTime: $("input[name='startTime']").val(),
            closeTime: $("input[name='closeTime']").val()
        };
        url = "/admin/updateClass";
    } else return;
    $.ajax({
        dataType: "json",
        type: "post",
        url: url,
        data: data,
        success: (data) => {
            if (data.status == 1) {
                alert(msg[flag] + "成功！");
                window.location.reload();
            } else {
                alert(msg[flag] + "失败！" + data.msg);
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
}

var deleteClass = (cid) => {
    if (confirm("是否删除该教学班？")) {
        $.ajax({
            dataType: "json",
            type: "post",
            url: "/admin/deleteClass",
            data: { classID: cid },
            success: (data) => {
                if (data.status == 1) {
                    alert("删除成功！");
                    window.location.reload();
                } else {
                    alert("删除失败！");
                }
            },
            error: (err) => {
                alert('与服务器连接异常，请稍后再试!');
            }
        });
    }
}