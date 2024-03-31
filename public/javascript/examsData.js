
let examPapersData=[];
let ExamsData=[];

var xhr = new XMLHttpRequest();
xhr.open("GET", "/api/admin/exams", true);

xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        let response = JSON.parse(xhr.responseText);
        if(xhr.status==200){
            let exams=response["exams"];
            ExamsData=exams;
            let i=0;
            let tbody=document.getElementById("tbody");
            while(i<exams.length){
                let exam=exams[i];
                tbody.innerHTML+=`<tr>
                <th >${exam._id}</th>
                <th >${exam.name}</th>
                <th >${exam.examDate}</th>
                <th >${exam.startTime}</th>
                <th >
                <button type="button" class="btn btn-primary btn-sm" onclick="generateExam('${exam._id}')">Re-generate</button>
                <button type="button" class="btn btn-outline-success btn-sm" onclick="downloadFile('${exam._id}')" data-bs-toggle="modal" data-bs-target="#modal">view</button>
                <button type="button" class="btn btn-outline-success btn-sm" onclick="examPapersModalSetter('${exam._id}')" data-bs-toggle="modal" data-bs-target="#modal">Exam papers</button>
                </th>
                </tr>`
                i++;
            }
        }
        else{
            var box=`<div class="alert alert-danger" role="alert">${response["msg"]}</div>`
            wholePageMessageShower.innerHTML=box;
            submitButton.disabled =false;
        }
    }
};

xhr.send();


function generateExam(examId){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/addAllocateSeat", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                console.log(response);
                alert("Exam generated successfully");
            }
            else{
                console.log(response);
                alert("Exam generation failed due to:- "+response["msg"]);
            }
        }
    };
    xhr.send(JSON.stringify({examId:examId}));
}

function examById(id){
    for(let i=0;i<ExamsData.length;i++){
        if(ExamsData[i]._id==id){
            return ExamsData[i];
        }
    }
    return null;
}

async function getExamPapers(examId){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/admin/examsPapers?examId=${examId}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                examPapersData=response["examPapers"];
                modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">`;
                let map={};
                for(let i=0;i<examPapersData.length;i++){
                    let examPaper=examPapersData[i];
                    map[examPaper.couseCode]=1;
                    modalBody.innerHTML+=`<h5>${examPaper.couseCode}:-  <button  class="btn btn-primary btn-sm" onclick="decryptFile('${examPaper._id}')">Download</button><h5>`;
                }
                let exam=examById(examId);
                for(let i=0;i<exam.courses.length;i++){
                    let course=exam.courses[i];
                    if(map[course]==undefined){
                        modalBody.innerHTML+=`<h5>${course}:-  Not Uploaded<h5>`;
                    }
                }
                modalBody.innerHTML+='</div>';
            }
            else{
                console.log(response);
                alert("geting exam papers failed due to:- "+response["msg"]);
            }
        }
    };
    xhr.send();
}

function downloadFile(id){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">Download</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
        <h3>Download the following files</h3>
        <a href="/excels/${id}.xlsx" class="btn btn-primary mt-3" download>seating-Download</a>
        <a href="/excels/${id}-classRoomData.xlsx" class="btn btn-primary mt-3" download>attedance-Download</a>
        <a href="/excels/${id}-notAllowedStudents.xlsx" class="btn btn-primary mt-3" download>not Eligible list-Download</a>
        </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
}

async function examPapersModalSetter(id){
    let data=await getExamPapers(id);
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">Exam papers</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
}

function examPapersById(id){
    for(let i=0;i<examPapersData.length;i++){
        if(examPapersData[i]._id==id){
            return examPapersData[i];
        }
    }
    return null;
}

async function decryptFile(examPaperId){
    let data=examPapersById(examPaperId);
    // fetch(`/papers/${data.paper}`)
    try {
        // Fetch the encrypted file from the backend
        const response = await fetch('/papers/questionPaper-1711862984008-.xlsx.enc');
        if (!response.ok) {
          throw new Error('Failed to fetch encrypted file');
        }
        
        // Get the encrypted file as a base64 string
        const encryptedFile = await response.blob();
    
        // Convert IV and key from base64
        const iv = data.iv;
        const key = data.key; 
    
        const ivBuffer = stringToArrayBuffer(iv);
        const keyBuffer = stringToArrayBuffer(key);
        
        const algorithm = { name: 'AES-CBC', iv: ivBuffer };
    
        const decryptedBuffer = await crypto.subtle.decrypt(
          algorithm,
          keyBuffer,
          await fileToArrayBuffer(encryptedFile)
        );
    
        const decryptedBlob = new Blob([decryptedBuffer], { type: 'application/octet-stream' });
    
        // Create a download link and trigger download
        const url = URL.createObjectURL(decryptedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'decrypted_file.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error:', error.message);
      }
}
    // Helper function to convert base64 string to ArrayBuffer
    function base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;

}


function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  // Helper function to convert Blob to ArrayBuffer
  function fileToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }
  function stringToArrayBuffer(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }