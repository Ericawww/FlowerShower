const MAX_FILE_SIZE = 20;

$(() => {
    $('.ui.progress').hide();
});

var showUploadModal = () => {
    $('.tiny.upload.modal').modal('show');
}

$("#selectFileBtn").click(() => {
    var file = document.getElementById('material').files[0];
    if (!file || file.size <= 0) {
        $("#materialName").html("");
        alert(`请先选择一个文件！`);
        return;
    }
    $("#materialName").html(file.name);
});


var submitHw = () => {
    var file = document.getElementById('material').files[0];
    if (!file || file.size <= 0) {
        alert(`请先选择一个文件！`);
        return;
    }
    if (file.size >= MAX_FILE_SIZE * 1024 * 1024) {
        alert(`文件大小不能超过${MAX_FILE_SIZE}MB`);
        return;
    }
    var formData = new FormData();
    formData.append('material', file);
    formData.append('description', $("textarea[name='description']").val());
    $('.ui.progress').show();
    $('.ui.progress').progress({ percent: 0 });
    $.ajax({
        url: './submit',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: (data, arg1, arg2) => {
            $('.ui.progress').progress({ percent: 100 });
            if (data.status) {
                alert('上传成功!');
            } else alert(data.msg);
            window.location.reload();
        },
        xhr: () => {
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', function (e) {
                var progressRate = (e.loaded / e.total) * 100;
                $('.ui.progress').progress({ percent: progressRate });
            });
            return xhr;
        },
        fail: () => {
            alert('服务器异常，请稍后再试！');
        }
    });
}