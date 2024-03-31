

function addExamPaper(){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">ADD EXAM PAPER</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
    <form id="add-students">
    <div class="input-group mb-3">
        <input type="file" class="form-control" id="excel" name="questionPaper">
        <label class="input-group-text" for="excel" >Exam paper</label>
    </div>
    <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">couse code</span>
  <input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="couseCode">
</div>
<div class="input-group mb-3">
<span class="input-group-text" id="basic-addon1">exam Id</span>
<input type="text" class="form-control"  aria-label="Username" aria-describedby="basic-addon1" name="examId">
</div>
</form>
        </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-warning" onclick="addStudentSumit()">submit</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
}


function addStudentSumit(){
    let form=document.getElementById("add-students");
    //send the data to the server using xarhttp
    let formData=new FormData(form);
    let xhr=new XMLHttpRequest();
    xhr.open("POST", "/api/teacher/addQuestionPaper", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                console.log(response);
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