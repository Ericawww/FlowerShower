var __footer = `<div class="ui inverted vertical footer segment" style="background-color: rgb(21, 126, 217); margin-top: 50px;">
    <div class="ui container">
      <div class="ui stackable inverted divided equal height stackable grid">
        <div class="four wide column">
          <h4 class="ui inverted header">指导老师</h4>
          <div class="ui inverted link list">
            <p><a href="https://person.zju.edu.cn/0092031" target="_blank" class="item"
                style="color: white;">浙江大学计算机科学与技术学院 邢卫</a></p>
            <p><a href="https://person.zju.edu.cn/0097412" target="_blank" class="item"
                style="color: white;">浙江大学计算机科学与技术学院 金波</a></p>
          </div>
        </div>
        <div class="three wide column">
          <h4 class="ui inverted header">项目作者</h4>
          <div class="ui inverted link list">
            <p>贺婷婷 应承峻 韩汶东 </p>
            <p>张佳瑶 方陶然 戴陈威</p>
          </div>
        </div>
        <div class="seven wide column">
          <h4 class="ui inverted header">技术支持</h4>
          <p>浙江大学计算机科学与技术学院-SEM&SRE-Group13</p>
          <p>软件工程专业-软件工程管理&软件需求工程-项目</p>
          <p>Group13</p>
        </div>
      </div>
    </div>
  </div>`;

$(() => {
  $("div.template-footer").html(__footer);
});

$(".ui.dropdown").dropdown();

var clickItem = (id) => {
  if (id == 0) {
    window.location.href = '/logout';
  } else if (id == 1) {
    window.location.href = '/users/settings';
  } else if (id == 2) {
    window.location.href = '/users/';
  }
}