var courseLists = [];
var selector = {
    courseNumber: '',
    courseName: '',
    courseDept: ''
}
var currentCourse;

$(() => {
    getCourses();
});

$("#selectCourseBtn").click(() => {
    $('.ui.sidebar').sidebar('toggle');
});

$("#deleteCourseBtn").click(() => {
    var params = [];
    for (let i = 0; i < courseLists.length; i++) {
        if (courseLists[i].checked) {
            params.push(courseLists[i].courseNumber);
        }
    }
    $(".delete.modal").find("strong").text(params.length);
    $('.delete.modal').modal('show');
});

var setSelector = (column, param) => {
    if (column == 'courseNumber') {
        selector.courseNumber = $(param).val();
    } else if (column == 'courseName') {
        selector.courseName = $(param).val();
    } else if (column == 'courseDept') {
        selector.courseDept = $(param).val();
    }
    console.log(selector);
    getCourses();
}

var getCourses = () => {
    $.ajax({
        dataType: "json",
        type: "post",
        url: "/admin/getCourses",
        data: selector,
        success: (data) => {
            //console.log(data);
            if (data.status == 1) {
                courseLists = data.courses;
                setCourseList();
            } else {
                alert('课程数据加载失败！');
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
}

var importCourse = () => {
    //console.log(currentCourse);
    $.ajax({
        dataType: "json",
        type: "post",
        url: "/admin/importCourse",
        data: currentCourse,
        success: (data) => {
            if (data.status == 1) {
                alert("添加成功！");
                $(".modal.import").modal("hide");
                getCourses();
            } else {
                alert('添加课程失败！原因：' + data.msg);
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
}

var updateCourse = () => {
    $.ajax({
        dataType: "json",
        type: "post",
        url: "/admin/updateCourse",
        data: currentCourse,
        success: (data) => {
            if (data.status == 1) {
                alert("修改成功！");
                $(".modal.import").modal("hide");
                getCourses();
            } else {
                alert('修改课程失败！原因：' + data.msg);
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
}

var deleteCourses = () => {
    var params = [];
    for (let i = 0; i < courseLists.length; i++) {
        if (courseLists[i].checked) {
            params.push(courseLists[i].courseNumber);
        }
    }
    if (params.length == 0) {
        alert("请先选择要删除的课程！");
        return;
    }
    $.ajax({
        dataType: "json",
        type: "post",
        url: "/admin/deleteCourses",
        traditional: true,
        data: { params: params },
        success: (data) => {
            if (data.status == 1) {
                alert("删除成功!");
                getCourses();
            } else {
                alert(data.msg);
            }
        },
        error: (err) => {
            alert('与服务器连接异常，请稍后再试!');
        }
    });
}

var setChecked = (index) => {
    courseLists[index].checked = !courseLists[index].checked;
}

var setCourseList = () => {
    var table = $(".course-table").find("tbody");
    $(table).html("");
    for (let i = 0; i < courseLists.length; i++) {
        courseLists[i].checked = false;
        var { courseNumber, courseName, courseDept, credit, prerequisite } = courseLists[i];
        var courseListTemplate = `<tr>
            <td class="collapsing">
              <div class="ui fitted slider checkbox">
                <input type="checkbox" onchange="setChecked(${i})"> <label></label>
              </div>
            </td>
            <td>${courseNumber}</td>
            <td>${courseName}</td>
            <td>${courseDept}</td>
            <td>${credit}</td>
            <td>${prerequisite}</td>
            <td>
              <i class="edit outline icon pointer" onclick="showCourseModal(${i})"></i>
              <i class="tasks icon pointer" onclick="showClasses('${courseNumber}')"></i>
            </td>
          </tr>`;
        $(table).append(courseListTemplate);
    }
    $('.ui.radio.checkbox').checkbox();
}

var showCourseModal = (index) => {
    var title;
    var courseNumberRef;
    var action;
    if (index == null) {
        currentCourse = {};
        title = '新建课程';
        courseNumberRef = 'courseNumber';
        action = 'importCourse()';
    } else {
        var { ...cloneObj } = courseLists[index];  //拷贝对象
        currentCourse = cloneObj;
        title = '修改课程';
        courseNumberRef = 'newCourseNumber';
        action = 'updateCourse()';
    }
    var { courseNumber, courseName, courseDept, credit, prerequisite, description, outline } = currentCourse;
    var template = `
    <div class="header">${title}</div>
    <div class="scrolling content">
      <form class="ui form">
        <div class="field">
          <label>CourseNumber</label>
          <input type="text" name="courseNumber" value="${courseNumber == null ? "" : courseNumber}" onchange="currentCourse.${courseNumberRef} = $(this).val()">
        </div>
        <div class="field">
          <label>CourseName</label>
          <input type="text" name="courseName" value="${courseName == null ? "" : courseName}" onchange="currentCourse.courseName = $(this).val()">
        </div>
        <div class="field">
          <label>CourseDept</label>
          <input type="text" name="courseDept" value="${courseDept == null ? "" : courseDept}" onchange="currentCourse.courseDept = $(this).val()">
        </div>
        <div class="field">
          <label>Credit</label>
          <input type="text" name="credit" value="${credit == null ? "" : credit}" onchange="currentCourse.credit = $(this).val()">
        </div>
        <div class="field">
          <label>Prerequisite</label>
          <input type="text" name="prerequisite" value="${prerequisite == null ? "" : prerequisite}" onchange="currentCourse.prerequisite = $(this).val()">
        </div>
        <div class="field">
          <label>Description</label>
          <textarea name="description" onchange="currentCourse.description = $(this).val()">${description == null ? "" : description}</textarea>
        </div>
        <div class="field">
          <label>Outline</label>
          <textarea name="outline" onchange="currentCourse.outline = $(this).val()">${outline == null ? "" : outline}</textarea>
        </div>
      </form>
    </div>
    <div class="actions">
      <div class="ui cancel button">关闭</div>
      <div class="ui green button" onclick="${action}">提交</div>
    </div>`;
    $(".modal.import").html(template);
    $(".modal.import").modal({ closable: false }).modal("show");
}

var showClasses = (index) => {
    window.location.href='/admin/class?cn=' + index;
}