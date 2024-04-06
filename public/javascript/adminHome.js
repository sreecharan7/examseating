
console.log("adminHome.js loaded...");

function addStudents(){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">ADD STUDENTS</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
    <form id="add-multiple-form">
    <div class="input-group mb-3">
        <input type="file" class="form-control" id="excel" name="excel">
        <label class="input-group-text" for="excel" >Excel</label>
    </div>
    <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">semester name</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="semesterName">
</div>
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">Start Date</span>
<input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="startDate">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">End Date</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="endDate">
</div>
</form>
        </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-warning" onclick="addDataToBase('/api/admin/addstudenstByExel')">submit</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
}

function addDataToBase(link){
    let form=document.getElementById("add-multiple-form");
    //send the data to the server using xarhttp
    let formData=new FormData(form);
    let xhr=new XMLHttpRequest();
    xhr.open("POST", link, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alert(response["message"]);
                return true;
            }
            else if(xhr.status==400){
                alert(response.msg);
              return false;
            }
            else{
              alert(response["message"]);
              return false;
            }
        }
    };
    xhr.send(formData);
}



function addCoursesToStudents(){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">ADD COURSES</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
    <form id="add-courses">
    <div class="input-group mb-3">
        <input type="file" class="form-control" id="excel" name="excel">
        <label class="input-group-text" for="excel" >Excel</label>
    </div>
    <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">semester name</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="semesterName">
</div>

</form>
        </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-warning" onclick="addCouresSumit()">submit</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;


}


function addCouresSumit(){
    let form=document.getElementById("add-courses");
    //send the data to the server using xarhttp
    let formData=new FormData(form);
    let xhr=new XMLHttpRequest();
    xhr.open("POST", "/api/admin/addcourseByExel", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alert(response.message);
                return true;
            }
            else if(xhr.status==400){
                alert(response.msg);
              return false;
            }
            else{
              alert(response.msg);
              return false;
            }
        }
    };
    xhr.send(formData);
}



function addClasses(){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">ADD CLASS</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
    <form id="add-courses">
    <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">class name</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="name" id="name">
</div>
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">No Of Teacher Required</span>
<input type="number" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="noOfTeacherRequired" id="noOfTeacherRequired">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">structure</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="structure" id="structure">
</div>
</form>
        </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-warning" onclick="addClassesSumit()">submit</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
}

function addClassesSumit(){

  const xhr = new XMLHttpRequest();
  xhr.open("POST",`/api/admin/addClasses`, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  const data = {
    name: $("#name").val(),
    noOfTeacherRequired: $("#noOfTeacherRequired").val(),
    structure: $("#structure").val()
  };
  console.log(data);
  var serializedData = new URLSearchParams(data).toString();
  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
          let response = JSON.parse(xhr.responseText);
          if(xhr.status==200){
              alertToast(`${response["message"]}`);
          }
          else{
              alertToast(`${response["msg"]}`);
          }
      }
  };
  xhr.send(serializedData);
}

function addExam(){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">ADD EXAM</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
    <form id="add-exam">
    <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">name</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="name" id="name">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">start Time</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="startTime">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">exam date</span>
  <input type="date" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="examDate">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">classes</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="classes" id="classes">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">courses</span>
  <input type="text" class="form-control ui-widget"  aria-label="Username" aria-describedby="basic-addon1" name="courses" id="courses">
</div>
</form>
        </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-warning" onclick="addExamSumit()">submit</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
    addKeyword();
}

function addExamSumit(){
    let coursesArray=$("#courses").val().split(",");
    let classesArray=$("#classes").val().split(",");
    let data={
        "name":$("#name").val(),
        "startTime":"2021-10-10",
        "examDate":"2021-10-10",
        "classes":classesArray,
        "courses":coursesArray
    }
    let xhr=new XMLHttpRequest();
    xhr.open("POST", "/api/admin/addExam", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alert(response.message);
                return true;
            }
            else if(xhr.status==400){
                alert(response.msg);
              return false;
            }
            else{
              alert(response.msg);
              return false;
            }
        }
    };
    xhr.send(serializedData);
}

function addTeacher(){
  modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">ADD TEACHER</h1>
  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
<form id="add-multiple-form">
<div class="input-group mb-3">
  <input type="file" class="form-control" id="excel" name="excel">
  <label class="input-group-text" for="excel" >Excel</label>
</div>
</form>
  </div>`;
modalFooter.innerHTML=`
<button type="button" class="btn btn-warning" onclick="addDataToBase('/api/admin/addTeacherByExel')">submit</button>
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
}


function addKeyword() {
  var availableTags = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme"
  ];
  function split( val ) {
    return val.split( /,\s*/ );
  }
  function extractLast( term ) {
    return split( term ).pop();
  }

  $( "#courses" )
    // don't navigate away from the field on tab when selecting an item
    .on( "keydown", function( event ) {
      if ( event.keyCode === $.ui.keyCode.TAB &&
          $( this ).autocomplete( "instance" ).menu.active ) {
        event.preventDefault();
      }
    })
    .autocomplete({
      minLength: 0,
      source: function( request, response ) {
        // delegate back to autocomplete, but extract the last term
        response( $.ui.autocomplete.filter(
          availableTags, extractLast( request.term ) ) );
      },
      focus: function() {
        // prevent value inserted on focus
        return false;
      },
      select: function( event, ui ) {
        var terms = split( this.value );
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push( ui.item.value );
        // add placeholder to get the comma-and-space at the end
        terms.push( "" );
        this.value = terms.join( ", " );
        return false;
      }
    });
}

function addTeacherManually(){
  modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">ADD TEACHER</h1>
  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
  modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
    <form id="add-multiple-form">
    <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">name</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="name" id="name">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">about</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="about" id="about">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">email</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="email" id="email">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">password</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="password" id="password">
</div>
</form>
        </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-warning" onclick="addTeacherOne()">submit</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
}

function addTeacherOne(){
  var data={
    "name":$("#name").val(),
    "about":$("#about").val(),
    "email":$("#email").val(),
    "password":$("#password").val()
  }
  let xhr=new XMLHttpRequest();
  xhr.open("POST", "/api/admin/addTeacherOne", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  var serializedData = new URLSearchParams(data).toString();
  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
          let response = JSON.parse(xhr.responseText);
          if(xhr.status==200){
              alert(response.message);
              return true;
          }
          else if(xhr.status==400){
              alert(response.msg);
            return false;
          }
          else{
            alert(response.msg);
            return false;
          }
      }
  };
  xhr.send(serializedData);
}

function addStudentManually(){
  //ask email name  password rollNo branch year startDate endDate semesterName
  modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">ADD STUDENT</h1>
  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
  modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
    <form id="add-multiple-form">
    <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">Name</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="name" id="name">
</div>
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">Email</span>
<input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="email" id="email">
</div>
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">Password</span>
<input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="password" id="password">
</div>
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">Roll No</span>
<input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="rollNo" id="rollNo">
</div>
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">Branch</span>
<input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="branch" id="branch">
</div>
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">Year</span>
<input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="year" id="year">
</div>
<div class="input-group mb-3">
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">Semester Name</span>
<input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="semesterName" id="semesterName">
</div>
<span class="input-group-text" id="basic-addon1">Start Date</span>
<input type="date" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="startDate" id="startDate">
</div>
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">End Date</span>
<input type="date" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="endDate" id="endDate">
</div>

</form>
</div>`

modalFooter.innerHTML=`
<button type="button" class="btn btn-warning" onclick="addStudentOne()">submit</button>
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;

}
function addStudentOne(){
  var data={
    "name":$("#name").val(),
    "email":$("#email").val(),
    "password":$("#password").val(),
    "branch":$("#branch").val(),
    "year":$("#year").val(),
    "rollNo":$("#rollNo").val(),
    "semesterName":$("#semesterName").val(),
    "startDate":$("#startDate").val(),
    "endDate":$("#endDate").val()
  }
  let xhr=new XMLHttpRequest();
  xhr.open("POST", "/api/admin/addStudentOne", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  var serializedData = new URLSearchParams(data).toString();
  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
          let response = JSON.parse(xhr.responseText);
          if(xhr.status==200){
              alert(response.message);
              return true;
          }
          else if(xhr.status==400){
              alert(response.msg);
            return false;
          }
          else{
            alert(response.msg);
            return false;
          }
      }
  };
  xhr.send(serializedData);
}