var navBarTemplate = `
    <div class="main navBar">
        <div class="ui menu" style="padding: 15px;">
            <a href="/" style="display: flex; left: auto; margin-left: 30%;"><img src="/images/logo.png" /></a>
            <div class="right menu" style="margin-right: 20%;">
            <div class="item">
                <div class="ui action left icon input">
                <i class="search icon"></i>
                <input type="text" placeholder="搜索感兴趣的课程" name="searchCourse" />
                <button class="ui positive button" onclick="searchCourse()" >搜索</button>
                </div>
            </div>
            <a class="item">使用教程</a>
            <a class="item" href="javascript:showMsgBoard()">留言反馈</a>
            </div>
        </div>
    </div>`;
var msgboardModalTemplate = `  <div class="ui msgboard modal">
    <i class="close icon"></i>
    <div class="header">留言反馈</div>
    <div class="content">
      <div class="ui form">
        <div class="field">
          <label>留言内容 <span class="neccessary">*</span></label>
          <textarea maxlength="250" placeholder="不超过300个字符" name="content"></textarea>
        </div>
        <div class="field">
          <label>您的联系方式 <span class="neccessary">*</span></label>
          <input type="text" name="contact" placeholder="可以是电话或邮箱，不超过32个字符" />
        </div>
      </div>
    </div>
    <div class="actions">
      <div class="ui red deny button">取消</div>
      <div class="ui positive button" onclick="submitMessageBoardMsg()">提交</div>
    </div>
  </div>`;

$(() => {
    var searchCheck = $(".main.navBar");
    if (searchCheck.length == 0) $("body").prepend(navBarTemplate);
    $.ajax({
        dataType: "json",
        type: "get",
        url: "/getUserToken",
        data: {},
        success: (data) => {
            if (data.token != null) {
                setNavBar(data.token);
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
});

var setNavBar = (token) => {
    var imgField;
    if (token.userPhoto != null) {
        imgField = `<img class="ui circular image" src="/${token.userPhoto}" style="width:32px;" onerror="this.src='/images/user.png'" />`
    } else {
        imgField = `<img class="ui circular image" src="/images/user.png" style="width:32px;" />`
    }
    navBarTemplate = `
        <div class="ui menu" style="padding: 15px;">
            <a href="/" style="display: flex; left: auto; margin-left: 30%;"><img src="/images/logo.png" /></a>
            <div class="right menu" style="margin-right: 20%;">
            <div class="item">
                <div class="ui action left icon input">
                <i class="search icon"></i>
                <input type="text" placeholder="搜索感兴趣的课程" name="searchCourse" />
                <button class="ui positive button" onclick="searchCourse()">搜索</button>
                </div>
            </div>
            <a class="item">使用教程</a>
            <a class="item" href="javascript:showMsgBoard()">留言反馈</a>
            <div class="item image" style="background: none;">
                <div class="ui icon top right pointing dropdown" id="photo-drop">
                ${imgField}
                <div class="menu">
                    <div class="item" onclick="window.location.href = '/users/';">个人中心</div>
                    <div class="item" onclick="window.location.href = '/users/settings';">设置</div>
                    <div class="item" onclick="window.location.href = '/logout';">注销</div>
                </div>
                </div>
            </div>
        </div>`;
    $(".main.navBar").html(navBarTemplate);
    $(".ui.dropdown").dropdown();
    $("body").append(msgboardModalTemplate);
}

var showMsgBoard = () => {
    $(".ui.msgboard.modal").modal("show");
};

var submitMessageBoardMsg = () => {
    if ($("textarea[name='content']").val().replace(" ", "") == "") {
        alert("留言内容不能为空！");
        return;
    }
    if ($("input[name='contact']").val().replace(" ", "") == "") {
        alert("联系方式不能为空！");
        return;
    }
    $.ajax({
        dataType: "json",
        type: "post",
        url: "/msgBoard",
        data: {
            content: $("textarea[name='content']").val(),
            contact: $("input[name='contact']").val()
        },
        success: data => {
            if (data.status) {
                alert("提交留言成功!");
                $("textarea[name='content']").val(""); //清空留言内容和联系方式
                $("input[name='contact']").val("");
                $(".ui.modal").modal("hide");
            } else {
                alert(data.msg);
            }
        },
        error: err => {
            alert("与服务器连接异常，请稍后再试!");
        }
    });
};

var searchCourse = () => {
    var searchCourseName = $("input[name='searchCourse']").val();
    console.log(searchCourseName);
    window.location.href="/courses/search?courseName="+searchCourseName;
}