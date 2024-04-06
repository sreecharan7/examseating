var xhr = new XMLHttpRequest();
xhr.open("GET", "/api/teacher/getAllTeachersData", true);

let teachersdata=[];

xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        let response = JSON.parse(xhr.responseText);
        if(xhr.status==200){
            teachersdata=response["data"];
            let tbody=document.getElementById("tbody");
            let i=0;
            while(i<teachersdata.length){
                let teacher=teachersdata[i];
                tbody.innerHTML+=`<tr>
                <th >${teacher.name}</th>
                <th >${teacher.about}</th>
                <th >
                <button type="button" class="btn btn-primary btn-sm" onclick="addCoursesModelCourse('${teacher._id}')" data-bs-toggle="modal" data-bs-target="#modal">Add Course</button>
                <button type="button" class="btn btn-outline-success btn-sm" onclick="viewCoursesModelSetter('${teacher._id}')" data-bs-toggle="modal" data-bs-target="#modal">view Courses</button>
                </th>
                </tr>`
                i++;
            }
        }        
        else{
            alert("failed to get the teachers");
        }
    }
}
xhr.send();


function viewCoursesModelSetter(teacherId){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">Courses</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
    getCourses(teacherId)
}
async function getCourses(teacherId){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/course/getCourses?teacherId=${teacherId}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                let data=response["data"];
                modalBody.innerHTML=`<div class="d-flex justify-content-center"><ul>`
                for(let i=0;i<data.length;i++){
                    modalBody.innerHTML+=`<li>${data[i].courseName}- ${data[i].courseCode}</li>`
                }
                if(data.length==0)modalBody.innerHTML+='No Couse Taken'
                modalBody.innerHTML+='</ul></div>'
            }
            else{
                console.log(response);
                alert("geting exam papers failed due to:- "+response["msg"]);
            }
        }
    };
    xhr.send();
}

function addCoursesModelCourse(teacherId){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">Add Courses</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
    <form id="add-exam">
    <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">Course Name</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="courseName" id="courseName1">
</div>
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">Course Code</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="startTime" id="courseCode">
</div>
</form>
  </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-warning" onclick="addCouseRequest('${teacherId}')">submit</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
    ;
}

function addCouseRequest(teacherId){
    const xhr = new XMLHttpRequest();
    xhr.open("POST",`/api/admin/addCoures`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    const data = {
        courseName: $("#courseName1").val(),
        courseCode: $("#courseCode").val(),
        teacherId: teacherId
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