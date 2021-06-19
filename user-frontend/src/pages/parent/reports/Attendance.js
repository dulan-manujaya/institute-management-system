import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
  Select,
  Input,
  Button,
} from "@windmill/react-ui";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import variables from "../../../common/globalVariables";
import PageTitle from "../../../components/Typography/PageTitle";
import SectionTitle from "../../../components/Typography/SectionTitle";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [attendanceResponse, setattendanceResponse] = useState([]);
  const totalResults = attendanceResponse.length;
  const [attendancePage, setAttendancePage] = useState(1);
  const [attendanceData, setAttendanceData] = useState([]);

  const [fromDate, setFromDate] = useState(new Date("10/23/2015"));
  const [toDate, setToDate] = useState(new Date());

  const [courseId, setCourseId] = useState("All");
  const [courseName, setCourseName] = useState("All");
  const [studentId, setStudentId] = useState("All");
  const [studentName, setStudentName] = useState("All");

  const resultsPerPage = 10;

  function onResultsPageChange(p) {
    setAttendancePage(p);
  }

  const getAllAttendance = async () => {
    try {
      const token = sessionStorage.getItem("parentAccessToken");
      const currParent = await axios.get(
        "http://localhost:4000/api/v1/parents/whoami",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const pid = currParent.data.guardian_id;
      var attendance = await axios.post(
        `${variables.apiServer}/api/v1/attendance/parent/StudentAttendance/${pid}`,
        {
          fromDate: fromDate.toISOString().substring(0, 10),
          toDate: toDate.toISOString().substring(0, 10),
          courseId: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (studentId != "All") {
        attendance.data = attendance.data.filter(
          (attendance) => attendance.student_id == studentId
        );
      }
      setAttendanceData(
        attendance.data.slice(
          (attendancePage - 1) * resultsPerPage,
          attendancePage * resultsPerPage
        )
      );
      setattendanceResponse(attendance.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllCourses = async () => {
    const token = sessionStorage.getItem("parentAccessToken");
    const currParent = await axios.get(
      "http://localhost:4000/api/v1/parents/whoami",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const pid = currParent.data.guardian_id;
    const courses = await axios.get(
      `${variables.apiServer}/api/v1/courses/getByParentId/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setCourses(courses.data);
  };

  const getAllStudents = async () => {
    const token = sessionStorage.getItem("parentAccessToken");
    const currParent = await axios.get(
      "http://localhost:4000/api/v1/parents/whoami",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const pid = currParent.data.guardian_id;
    const students = await axios.get(
      `${variables.apiServer}/api/v1/students/getByParentId/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setStudents(students.data);
  };

  useEffect(() => {
    getAllAttendance();
    getAllCourses();
    getAllStudents();
  }, [attendancePage]);

  useEffect(() => {
    setAttendanceData(
      attendanceResponse.slice(
        (attendancePage - 1) * resultsPerPage,
        attendancePage * resultsPerPage
      )
    );
  }, [attendancePage]);

  const generatePDF = () => {
    const doc = new jsPDF();
    var col = ["Date", "Course", "Student"];
    var rows = [];
    attendanceResponse.map((item) => {
      rows.push([
        new Date(item.att_date).toLocaleDateString(),
        item.course_name,
        item.student_name,
      ]);
    });
    doc.setFontSize(40);
    doc.text("Parent - Student Attendance", 15, 15);

    doc.setFontSize(16);
    doc.text(`From Date : ${fromDate.toISOString().substring(0, 10)}`, 15, 30);
    doc.text(`To Date : ${toDate.toISOString().substring(0, 10)}`, 15, 40);
    doc.text(`Course : ${courseName == null ? courseId : courseName}`, 15, 50);
    doc.text(
      `Student : ${studentName == null ? studentId : studentName}`,
      15,
      60
    );
    doc.autoTable(col, rows, { startY: 70 });
    doc.save("Parent - Student Attendance.pdf");
  };

  return (
    <>
      <PageTitle>Attendance</PageTitle>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <SectionTitle>From Date</SectionTitle>
          <Input
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
            type="date"
            value={fromDate.toISOString().substring(0, 10)}
            max={toDate.toISOString().substring(0, 10)}
            onChange={(e) => {
              setFromDate(new Date(e.target.value));
            }}
          />
          <SectionTitle>To Date</SectionTitle>
          <Input
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
            type="date"
            value={toDate.toISOString().substring(0, 10)}
            min={fromDate.toISOString().substring(0, 10)}
            onChange={(e) => {
              setToDate(new Date(e.target.value));
            }}
          />
        </div>
        <div>
          <SectionTitle>Courses</SectionTitle>
          <Select
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
            onChange={(e) => {
              setCourseId(e.target.value);
              setCourseName(
                e.target.options[e.target.selectedIndex].getAttribute(
                  "course_name"
                )
              );
            }}
          >
            <option key={"-1"}>All</option>
            {courses.map((enrollment, i) => (
              <option
                key={enrollment.course_id}
                value={enrollment.course_id}
                course_name={enrollment.course_name}
              >
                {enrollment.course_name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <SectionTitle>Students</SectionTitle>
          <Select
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
            onChange={(e) => {
              setStudentId(e.target.value);
              setStudentName(
                e.target.options[e.target.selectedIndex].getAttribute(
                  "student_name"
                )
              );
            }}
          >
            <option key={"-1"}>All</option>
            {students.map((student, i) => (
              <option
                key={student.student_id}
                value={student.student_id}
                student_name={student.student_name}
              >
                {student.student_name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <Button onClick={() => getAllAttendance()} className="my-4 w-1/4">
        Apply Filters
      </Button>
      <TableContainer className="mb-4">
        <Table>
          <TableHeader>
            <tr className="text-gray-700 dark:text-gray-200">
              <TableCell>Date</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Student</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {!attendanceData
              ? null
              : attendanceData.map((attendance, i) => (
                  <TableRow
                    key={i}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <TableCell>
                      <span className="text-sm">
                        {new Date(attendance.att_date).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{attendance.course_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{attendance.student_name}</span>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onResultsPageChange}
          />
        </TableFooter>
      </TableContainer>
      <Button onClick={() => generatePDF()} className="my-4 w-1/4">
        Print
      </Button>
    </>
  );
};

export default Attendance;
