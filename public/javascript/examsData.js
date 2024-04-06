
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
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteExamModel('${exam._id}')" data-bs-toggle="modal" data-bs-target="#modal">Delete</button>
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

function deleteExamModel(id){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Exam</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
        <h3>Are you sure you want to delete this exam?</h3>
        <button class="btn btn-danger mt-3" onclick="deleteExamConfirm('${id}')">Delete</button>
        </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
}
function deleteExamConfirm(id){
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/api/admin/examDelete?examId=${id}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alert("Exam deleted successfully");
                location.reload();
            }
            else{
                console.log(response);
                alert("Exam deletion failed due to:- "+response["msg"]);
            }
        }
    };
    xhr.send();
}


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
                    // modalBody.innerHTML+=`<h5>${examPaper.couseCode}:-  <a  class="btn btn-primary btn-sm" href="/papers/${examPaper.paper}" download>Download</a><h5>`;

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

async function decryptFile(examPaperId) {
    let data = examPapersById(examPaperId);
    var key = CryptoJS.enc.Hex.parse(`${data.key}`);
    var iv = CryptoJS.enc.Hex.parse(`${data.iv}`);
    var encryptedFilePath = `/papers/${data.paper}`;

    try {
        const response = await fetch(encryptedFilePath);
        const arrayBuffer = await response.arrayBuffer();

        // Create a WordArray from the ArrayBuffer
        var encryptedText = CryptoJS.lib.WordArray.create(arrayBuffer);
        var aesDecryptor = CryptoJS.algo.AES.createDecryptor(key, { iv: iv });

        // Variables for decrypted parts
        var decryptedParts = [];
        var chunkSize = 1024; // You can adjust the chunk size as needed

        for (var i = 0; i < encryptedText.sigBytes; i += chunkSize) {
            var chunk = CryptoJS.lib.WordArray.create(encryptedText.words.slice(i, i + chunkSize));
            var decryptedChunk = aesDecryptor.process(chunk);

            // Store the decrypted chunks
            decryptedParts.push(decryptedChunk);
        }

        // Finalize the decryption
        var decryptedFinal = aesDecryptor.finalize();

        // Combine decrypted parts into a single WordArray
        var decryptedWordArray = CryptoJS.lib.WordArray.create();
        for (var part of decryptedParts) {
            decryptedWordArray.concat(part);
        }
        decryptedWordArray.concat(decryptedFinal);

        // Convert the WordArray to an ArrayBuffer
        var decryptedArrayBuffer = wordArrayToBuffer(decryptedWordArray);

        // Create a Blob from the decrypted ArrayBuffer
        var blob = new Blob([decryptedArrayBuffer], { type: response.headers.get('content-type') });

        // Create a temporary URL for the Blob
        var url = URL.createObjectURL(blob);

        // Create a link element for download
        var link = document.createElement('a');
        link.href = url;
        link.download = fileName(data); // Set the filename based on the original filename

        // Append the link to the body and click it programmatically
        document.body.appendChild(link);
        link.click();

        // Clean up - remove the link and revoke the URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error fetching or decrypting file:', error);
    }
}

// Custom function to convert WordArray to ArrayBuffer
function wordArrayToBuffer(wordArray) {
    var len = wordArray.sigBytes;
    var words = wordArray.words;
    var buffer = new ArrayBuffer(len);
    var uint8View = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
        uint8View[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return buffer;
}
function fileName(data){
    let exam=examById(data.examId);
    let filename="";
    filename=data.couseCode+"-"+exam.name+"."+extractType(data.paper);
    return filename;
}
function extractType(fileName){
    console.log(fileName);
    let d=fileName.split(".");
    return d[d.length-2];
}