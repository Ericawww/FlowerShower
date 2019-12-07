const MAX_FILE_SIZE = 20;

var showUploadModal = () => {
    $('.ui.progress').hide();
    $('.tiny.upload.modal').modal('show');
}

var postFile = () => {
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
    formData.append('classProjectID', null);
    $('.ui.progress').show();
    $('.ui.progress').progress({ percent: 0 });
    $.ajax({
        url: './material/receive',
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

var removeMaterial = (mid) => {
    if (confirm("确定删除该资料吗？")) {
        $.ajax({
            dataType: "json",
            type: "post",
            url: "./material/remove",
            data: {
                classProjectID: null,
                materialID: mid
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