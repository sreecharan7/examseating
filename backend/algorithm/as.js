// const fs = require('fs');
// const students = JSON.parse(fs.readFileSync('./privatedata/jsondata/anewstudents.json'));
// const exam_halls = JSON.parse(fs.readFileSync('./privatedata/jsondata/anewclasses.json'));

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
    }
}
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
    console.log(classes)
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
                    if ((myarray[i][j][k][l] == 0) && (l == 0 || (l == 1 && myarray[i][j][k][l - 1] != som) || (l > 1 && myarray[i][j][k][l - 1] != som && myarray[i][j][k][l - 2] != som))) {
                        final_seats[i][j][k][l] = stuts[v];
                        myarray[i][j][k][l] = som; v = v + 1;
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
function fill_class_grace(myarray, stuts, som, final_seats) {
    let v = 0;
    for (let i = 0; i < myarray.length; i++) {
        for (let j = 0; j < myarray[i].length; j++) {
            for (let k = 0; k < myarray[i][j].length; k++) {
                let fl=0;
                for (let l = 0; l < myarray[i][j][k].length; l = l + 1) {
                    if (v == stuts.length) break;
                    if ((myarray[i][j][k][l] == 0) && (l == 0 || (l == 1 && myarray[i][j][k][l - 1] != som) || (l > 1 && myarray[i][j][k][l - 1] != som && myarray[i][j][k][l - 2] != som))) {
                        final_seats[i][j][k][l] = stuts[v];
                        myarray[i][j][k][l] = som; v = v + 1;
                        fl=1;
                    }
                }
                if(fl){
                    k=k+1;
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
function retu_object(final_seats, exam_halls) {
    let final_object = {};
    final_object.error = false;
    let cs = []
    let cs1 = []
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
    for (let i = 0; i < final_seats.length; i = i + 1) {
        let a1 = {};
        a1.name = exam_halls[i].name;
        a1.isfilled = true;
        if (final_seats[i].length == 0 || final_seats[i][0][0][0] == 0) {
            a1.isfilled = false;
        }
        let fima = 0;
        let mb = 0;
        let siz = [];
        for (let j = 0; j < final_seats[i].length; j = j + 1) {
            if (final_seats[i][j].length > mb) {
                mb = final_seats[i][j].length;
            }
            let ma = 0;
            for (let k = 0; k < final_seats[i][j].length; k = k + 1) {
                if (final_seats[i][j][k].length > ma) {
                    ma = final_seats[i][j][k].length;
                }
            }
            siz.push(ma);
            fima = fima + ma;
        }
        let cs2 = []
        let f = 0;
        let arrayWithZeros1 = new Array(fima).fill("-1");
        for (let k = 0; k < siz.length; k++) {
            for (let l = 0; l < siz[k]; l = l + 1) {
                arrayWithZeros1[f + l] = `row${k + 1}`;
            }
            f += siz[k];
        }
        cs2.push(arrayWithZeros1);
        for (let j = 0; j < mb; j = j + 1) {

            let mc = 0;
            let arrayWithZeros = new Array(fima).fill("-");

            for (let k = 0; k < siz.length; k++) {
                if (final_seats[i][k][j]){
                    for (let l = 0; l < siz[k] && l < final_seats[i][k][j].length; l = l + 1) {
                        arrayWithZeros[mc + l] = final_seats[i][k][j][l];
                    }
                    mc += siz[k];
                }
                
            }
            cs2.push(arrayWithZeros)
        }
        a1.seating = cs2;

        cs1.push(a1)
    }

    final_object.classes = cs;
    final_object.classes_data = cs1;
    return final_object
}


export function gets_seating(data, basedon = "year",grace=0) {
    let students = data.students
    let exam_halls = data.classes
    // console.log(students, exam_halls)
    shuffleArray(exam_halls);
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
    if(!grace){
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
    }else{
        for (let key of sortedMapDesc.keys()) {
            classes[key].sort();
            if (fill_class_grace(class_vis, classes[key], key, final_seats) == 0) {
                let hjk = {
                    "error": true,
                    "msg": "GIVEN CLASSES ARE NOT ENOUGH WITH GRACE TRY WITHOUT GRACE OR INCREASE NO OF CLASSES"
                }
                return hjk;
            }
        }
    }
    return retu_object(final_seats, exam_halls)


}
