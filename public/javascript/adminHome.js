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
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="name">
</div>
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">No Of Teacher Required</span>
<input type="number" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="noOfTeacherRequired">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">structure</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="structure">
</div>
</form>
        </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-warning" onclick="addClassesSumit()">submit</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
}

function addClassesSumit(){
    let form=document.getElementById("add-courses");
    //send the data to the server using xarhttp
    let formData=new FormData(form);
    //data in form of structure
    let structure=formData.get("structure");
    let structureArray=structure.split(",");
    let structureClassArray=[];
    for(let i=0;i<structureArray.length;i++){
        let structureClass=structureArray[i].split(" ");
        for(let i=0;i<structureClass.length;i++){
            if(structureClass[i]==""){
                structureClass.splice(i,1);
            }
        }
        structureClassArray.push(structureClass);
    }

    console.log(structureClassArray);
    formData.delete("structure");
    formData.append("structure",JSON.stringify(structureClassArray));
    let data=[
        {
            "name":"class1",
            "noOfTeacherRequired":2,
            "structure":structureClassArray
        }
    ]



    let xhr=new XMLHttpRequest();
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.open("POST", "/api/admin/addClasses", true);
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
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="courses" id="courses">
</div>
</form>
        </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-warning" onclick="addExamSumit()">submit</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
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