$("#pic").click(() => {
    $('.ui.modal').modal('show');
});
$("#userImage").cropper({
    aspectRatio: 1 / 1,
    viewMode: 1,
    dragMode: 'move',//裁剪框的模式
    preview: ".preview-box",
    autoCropArea: 1
});
$("#replace").click(() => {
    $("#imageSrc").click();
});
$("#changeImage").click(() => {
    if ($("#userImage").attr("src") == null) {
        alert("请先选择一张图片！");
        return false;
    } else {
        var cas = $('#userImage').cropper('getCroppedCanvas');// 获取被裁剪后的canvas  
        var base64 = cas.toDataURL('image/jpeg'); // 转换为base64  
        uploadFile(encodeURIComponent(base64)); //编码后上传服务器
    }
});
$("#saveButton").click(() => {
    var $userName = trim($("input[name='userName']").val());
    var $phoneNumber = trim($("input[name='phoneNumber']").val());
    var $birth = trim($("input[name='birth']").val());
    var $userIntro = trim($("textarea[name='userIntro']").val());
    var $gender = $("input[name='gender']:checked").val();
    //console.log($userName, $phoneNumber, $birth, $userIntro, $gender);
    $("#saveErrMsg").html(``).hide();
    if ($userName == "" || $userName == null) {
        $("input[name='userName']").parent().addClass("field error");
        $("#saveErrMsg").html(`<div class="header">请输入真实姓名！</div>`).show();
        return;
    } else if ($gender != 1 && $gender != 0) {
        $("input[name='gender']").parent().addClass("field error");
        $("#saveErrMsg").html(`<div class="header">请选择性别！</div>`).show();
        return;
    }
    $.ajax({
        dataType: "json",
        type: "post",
        url: "/users/updateUserInfo",
        data: {
            userName: $userName,
            phoneNumber: $phoneNumber == "" ? null : $phoneNumber,
            birth: $birth == "" ? null : $birth,
            userIntro: $userIntro == "" ? null : $userIntro,
            gender: $gender
        },
        success: (data) => {
            if (data.status == 1) {
                alert("修改成功");
                window.location.reload();
            } else {
                $("#saveErrMsg").html(`<div class="header">${data.msg}</div>`).show();
            }
        },
        error: (err) => {
            $("#saveErrMsg").html(`<div class="header">与服务器连接异常，请稍后再试!</div>`).show();
        }
    });
});
$("#resetButton").click(() => {
    var $oldPwd = $("input[name='oldPwd']").val();
    var $newPwd = $("input[name='newPwd']").val();
    var $confirmPwd = $("input[name='confirmPwd']").val();
    console.log($oldPwd, $newPwd, $confirmPwd);
    $("#resetErrMsg").html(``).hide();
    $("input").parent().removeClass("field error");
    if ($confirmPwd != $newPwd) {
        $("input[name='confirmPwd']").parent().addClass("field error");
        $("#resetErrMsg").html(`<div class="header">新密码必须与确认密码一致！</div>`).show();
        return;
    }
    $.ajax({
        dataType: "json",
        type: "post",
        url: "/users/updateUserPwd",
        data: {
            oldPwd: $oldPwd,
            newPwd: $newPwd
        },
        success: (data) => {
            if (data.status == 1) {
                alert("密码修改成功！");
                window.location.reload();
            } else {
                $("#resetErrMsg").html(`<div class="header">${data.msg}</div>`).show();
            }
        },
        error: (err) => {
            console.log(err);
            $("#resetErrMsg").html(`<div class="header">与服务器连接异常，请稍后再试!</div>`).show();
        }
    });
});

var changeSrc = (file) => {
    if (!file.files || !file.files[0]) return;
    var reader = new FileReader();
    reader.onload = function (evt) {
        var replaceSrc = evt.target.result;
        $('#userImage').cropper('replace', replaceSrc, false);// 默认false，适应高度，不失真  
    }
    reader.readAsDataURL(file.files[0]);
}
var uploadFile = (file) => {
    console.log(file.length);
    if (file.length > 1024 * 1000) {
        alert("文件应该小于1MB！");
        return;
    }
    $.ajax({
        url: '/users/uploadImage',
        type: 'POST',
        dataType: "JSON",
        data: {
            imgBase64: file
        },
        async: true,
        success: (data) => {
            if (data.status == 1) {
                alert("上传头像成功");
                $("#pic").prop("src", "/" + data.newPath);  //更新头像显示
                $(".usernav-photo").prop("src", "/" + data.newPath);
            } else {
                alert(data.msg);
            }
        },
        fail: (err) => {
            alert("上传头像失败，请检查网络连接！");
        }
    });
}  