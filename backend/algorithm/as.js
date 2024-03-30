// const fs = require('fs');
// const students = JSON.parse(fs.readFileSync('./privatedata/jsondata/anewstudents.json'));
// const exam_halls = JSON.parse(fs.readFileSync('./privatedata/jsondata/anewclasses.json'));


function make_visarray(exam_halls) {
    let class_vis_array = [];
    for (let i = 0; i < exam_halls.length; i = i + 1) {
        let ai = [];
        for (let j = 0; j < exam_halls[i].structure.length; j = j + 1) {
            let aj = [];
            for (let k = 0; k < exam_halls[i].structure[j].length; k = k + 1) {
                let no = exam_halls[i].structure[j][k];
                let arrayWithZeros = new Array(no).fill(0);
                aj.push(arrayWithZeros)
            }
            ai.push(aj)
        }
        class_vis_array.push(ai);
    }
    return class_vis_array
}

function make_students_year(classes, fooddata) {
    let mymap = new Map();
    for (let i = 0; i < fooddata.length; i++) {
        if (!classes[fooddata[i].year]) {
            classes[fooddata[i].year] = fooddata[i].students;
            mymap.set(fooddata[i].year, fooddata[i].students.length);
        } else {
            classes[fooddata[i].year] = classes[fooddata[i].year].concat(fooddata[i].students);
            mymap.set(fooddata[i].year, fooddata[i].students.length + mymap.get(fooddata[i].year));
        }
    }

    let sortedMapDesc = new Map([...mymap.entries()].sort((a, b) => b[1] - a[1]));
    return sortedMapDesc
}
function make_students_course(classes, fooddata) {
    let mymap = new Map();
    for (let i = 0; i < fooddata.length; i++) {
        if (!classes[fooddata[i].course]) {
            classes[fooddata[i].course] = fooddata[i].students;
            mymap.set(fooddata[i].course, fooddata[i].students.length);
        } else {
            classes[fooddata[i].course] = classes[fooddata[i].course].concat(fooddata[i].students);
            mymap.set(fooddata[i].course, fooddata[i].students.length + mymap.get(fooddata[i].course));
        }
    }

    let sortedMapDesc = new Map([...mymap.entries()].sort((a, b) => b[1] - a[1]));
    return sortedMapDesc
}

function fill_class(myarray, stuts, som, final_seats) {
    let v = 0;
    for (let i = 0; i < myarray.length; i++) {
        for (let j = 0; j < myarray[i].length; j++) {
            for (let k = 0; k < myarray[i][j].length; k++) {
                for (let l = 0; l < myarray[i][j][k].length; l = l + 1) {
                    if (v == stuts.length) break;
                    if ((myarray[i][j][k][l] == 0) && (l == 0 || myarray[i][j][k][l - 1] != som)) {
                        final_seats[i][j][k][l] = stuts[v];
                        myarray[i][j][k][l] = som; v = v + 1;
                        break;
                    }
                }
            }
        }
    }
    if (v < stuts.length) {
        return 0;
    } else {
        return 1;
    }
}

function retu_object(final_seats, exam_halls){
    let final_object = {};
    final_object.error = false;
    let cs = []
    for (let i = 0; i < final_seats.length; i = i + 1) {
        let a1 = {};
        a1.name = exam_halls[i].name;
        a1.isfilled = true;
        a1.seating = final_seats[i];
        if (final_seats[i].length == 0 || final_seats[i][0][0][0] == 0) {
            a1.isfilled = false;
        }
        cs.push(a1);
    }
    final_object.classes = cs;
    return final_object
}
// export function gets_seating(students1, exam_halls1,basedon) {
//     let class_vis = make_visarray(exam_halls);
//     var final_seats = JSON.parse(JSON.stringify(class_vis));
//     var classes = {};
//     let sortedMapDesc=new Map();
//     if (basedon=="year"){
//         sortedMapDesc = make_students_year(classes, students)
//     }else{
//         sortedMapDesc = make_students_course(classes, students)
//     }
//     // console.log(sortedMapDesc)
//     for (let key of sortedMapDesc.keys()) {
//         if (fill_class(class_vis, classes[key], key, final_seats) == 0) {
//             let hjk = {
//                 "error": true,
//                 "msg": "ALL THE STUDENTS CANNOT BE FILLED IN THE GIVEN CLASSES"
//             }
//             return hjk;
//         }
//     }
//     return retu_object(final_seats, exam_halls)
    

// }

export function gets_seating(data, basedon="year") {

    let students=data.students
    let exam_halls=data.classes
    let class_vis = make_visarray(exam_halls);
    var final_seats = JSON.parse(JSON.stringify(class_vis));
    var classes = {};
    let sortedMapDesc = new Map();
    if (basedon == "year") {
        sortedMapDesc = make_students_year(classes, students)
    } else {
        sortedMapDesc = make_students_course(classes, students)
    }
    // console.log(sortedMapDesc)
    for (let key of sortedMapDesc.keys()) {
        classes[key].sort();
        if (fill_class(class_vis, classes[key], key, final_seats) == 0) {
            let hjk = {
                "error": true,
                "msg": "ALL THE STUDENTS CANNOT BE FILLED IN THE GIVEN CLASSES"
            }
            return hjk;
        }
    }
    return retu_object(final_seats, exam_halls)


}
