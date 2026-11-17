class Student {

    #grades;
    #attendance;

    constructor(name, grades, attendance) {
        this.name = name;
        this.grades = grades;
        this.attendance = attendance;
    }

    set grades(value) {
        for (let grade of value) {
            if (grade < 0 || grade > 100) {
                throw new Error("الدرجة يجب أن تكون من 0 إلى 100");
            }
        }

        this.#grades = value;
    }

    get grades() {
        return this.#grades;
    }

    set attendance(value) {
        if (value < 0 || value > 100) {
            throw new Error("نسبة الحضور يجب أن تكون من 0 إلى 100");
        }

        this.#attendance = value;
    }

    get attendance() {
        return this.#attendance;
    }

    calculateAverage() {
        return this.#grades.reduce((sum, grade) => sum + grade, 0) / 3;
    }

    getResult() {
        if (this.calculateAverage() >= 50 && this.#attendance >= 75) {
            return "ناجح";
        } else {
            return "راسب";
        }
    }
}

let studentsList = [];

let studentName = document.getElementById("studentName");
let grade1 = document.getElementById("grade1");
let grade2 = document.getElementById("grade2");
let grade3 = document.getElementById("grade3");
let attendance = document.getElementById("attendance");

let addStudent = document.getElementById("addStudent");
let activateCommittee = document.getElementById("activateCommittee");

let error = document.getElementById("error");
let studentList = document.getElementById("studentList");
let committeeReport = document.getElementById("committeeReport");


addStudent.onclick = function() {

    try {

        error.innerHTML = "";

        if (
            studentName.value.trim() === "" ||
            grade1.value === "" ||
            grade2.value === "" ||
            grade3.value === "" ||
            attendance.value === ""
        ) {
            throw new Error("من فضلك أدخل جميع البيانات");
        }

        let grades = [
            Number(grade1.value),
            Number(grade2.value),
            Number(grade3.value)
        ];

        let student = new Student(
            studentName.value.trim(),
            grades,
            Number(attendance.value)
        );

        studentsList.push(student);

        studentList.innerHTML += `
            <div class="border rounded p-3 mb-2">
                <p>اسم الطالب: ${student.name}</p>
                <p>المتوسط: ${student.calculateAverage().toFixed(2)}</p>
                <p>الحضور: ${student.attendance}%</p>
                <p>النتيجة: ${student.getResult()}</p>
            </div>
        `;

        studentName.value = "";
        grade1.value = "";
        grade2.value = "";
        grade3.value = "";
        attendance.value = "";

    } catch (errorMessage) {

        error.innerHTML = errorMessage.message;

    }
};


activateCommittee.onclick = function() {

    let strugglingStudents = studentsList.filter(function(student) {
        return student.calculateAverage() >= 40 &&
               student.calculateAverage() < 50;
    });

    let newAverages = strugglingStudents.map(function(student) {
        return student.calculateAverage() + 5;
    });

    let total = newAverages.reduce(function(sum, average) {
        return sum + average;
    }, 0);

    let report = "";

    if (strugglingStudents.length === 0) {

        report = "لا يوجد طلاب في لجنة الرأفة";

    } else {

        let generalAverage = total / strugglingStudents.length;

        report = `
            <h3>تقرير لجنة الرأفة</h3>
            <p>عدد الطلاب المتعثرين: ${strugglingStudents.length}</p>
        `;

        strugglingStudents.map(function(student) {
            report += `
                <p>
                    اسم الطالب: ${student.name}
                    - المتوسط بعد الرأفة: 
                    ${(student.calculateAverage() + 5).toFixed(2)}
                </p>
            `;
        });

        report += `
            <h4>
                المتوسط العام بعد الرأفة:
                ${generalAverage.toFixed(2)}
            </h4>
        `;
    }

    committeeReport.innerHTML = report;
};