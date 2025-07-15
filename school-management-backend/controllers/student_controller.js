import bcrypt from 'bcrypt';
import Student from '../models/studentSchema.js';
import Subject from '../models/subjectSchema.js';

const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            const student = new Student({
                ...req.body,
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    console.log('StudentLogin route hit', req.body);
    try {
        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                return res.status(200).json({ success: true, student });
            } else {
                return res.status(401).json({ success: false, message: "Invalid password" });
            }
        } else {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message || err });
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (student) {
            student.password = undefined;
            res.send(student);
        }
        else {
            res.send({ message: "No student found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Attendance Analytics Endpoint
const getAttendanceAnalytics = async (req, res) => {
    try {
        const { schoolId, classId, subjectId, studentId, startDate, endDate } = req.query;
        let filter = {};
        if (schoolId) filter.school = schoolId;
        if (classId) filter.sclassName = classId;
        if (studentId) filter._id = studentId;

        // Fetch students matching the filter
        const students = await Student.find(filter).populate('attendance.subName', 'subName');
        let attendanceRecords = [];
        students.forEach(student => {
            student.attendance.forEach(record => {
                // Filter by subject
                if (subjectId && record.subName && record.subName._id.toString() !== subjectId) return;
                // Filter by date
                if (startDate && new Date(record.date) < new Date(startDate)) return;
                if (endDate && new Date(record.date) > new Date(endDate)) return;
                attendanceRecords.push({
                    studentId: student._id,
                    studentName: student.name,
                    classId: student.sclassName,
                    subjectId: record.subName?._id,
                    subjectName: record.subName?.subName,
                    date: record.date,
                    status: record.status
                });
            });
        });
        // Aggregate analytics
        const total = attendanceRecords.length;
        const present = attendanceRecords.filter(r => r.status === 'Present').length;
        const absent = attendanceRecords.filter(r => r.status === 'Absent').length;
        // Group by subject
        const bySubject = {};
        attendanceRecords.forEach(r => {
            if (!r.subjectName) return;
            if (!bySubject[r.subjectName]) bySubject[r.subjectName] = { present: 0, absent: 0, total: 0 };
            bySubject[r.subjectName].total++;
            if (r.status === 'Present') bySubject[r.subjectName].present++;
            if (r.status === 'Absent') bySubject[r.subjectName].absent++;
        });
        // Group by date (for trends)
        const byDate = {};
        attendanceRecords.forEach(r => {
            const d = new Date(r.date).toISOString().substring(0, 10);
            if (!byDate[d]) byDate[d] = { present: 0, absent: 0, total: 0 };
            byDate[d].total++;
            if (r.status === 'Present') byDate[d].present++;
            if (r.status === 'Absent') byDate[d].absent++;
        });
        res.json({
            total,
            present,
            absent,
            bySubject,
            byDate,
            records: attendanceRecords
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudent,
  deleteStudents,
  deleteStudentsByClass,
  updateStudent,
  updateExamResult,
  studentAttendance,
  clearAllStudentsAttendanceBySubject,
  clearAllStudentsAttendance,
  removeStudentAttendanceBySubject,
  removeStudentAttendance,
  getAttendanceAnalytics,
};
