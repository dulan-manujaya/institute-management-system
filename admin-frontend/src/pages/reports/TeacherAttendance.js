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
import variables from "../../common/globalVariables";
import PageTitle from "../../components/Typography/PageTitle";
import SectionTitle from "../../components/Typography/SectionTitle";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const TeacherAttendance = () => {
  const [teachers, setTeachers] = useState([]);

  const [attendanceResponse, setattendanceResponse] = useState([]);
  const totalResults = attendanceResponse.length;
  const [attendancePage, setAttendancePage] = useState(1);
  const [attendanceData, setAttendanceData] = useState([]);

  const [fromDate, setFromDate] = useState(new Date("10/23/2015"));
  const [toDate, setToDate] = useState(new Date());
  const [teacherId, setTeacherId] = useState("All");

  const resultsPerPage = 10;

  function onResultsPageChange(p) {
    setAttendancePage(p);
  }

  const getAllAttendance = async () => {
    try {
      const token = sessionStorage.getItem("adminAccessToken");
      var attendance = await axios.post(
        `${variables.apiServer}/api/v1/attendance/teacher/dates`,
        {
          fromDate: fromDate.toISOString().substring(0, 10),
          toDate: toDate.toISOString().substring(0, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(attendance);
      if (teacherId != "All") {
        attendance.data = attendance.data.filter(
          (attendance) => attendance.student_id == teacherId
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

  const getAllTeachers = async () => {
    const token = sessionStorage.getItem("adminAccessToken");
    const teachers = await axios.get(`${variables.apiServer}/api/v1/teachers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTeachers(teachers.data);
  };

  useEffect(() => {
    getAllAttendance();
    getAllTeachers();
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
    doc.autoTable(col, rows);
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
      </div>
      <Button onClick={() => getAllAttendance()} className="my-4 w-1/4">
        Apply Filters
      </Button>
      <TableContainer className="mb-4">
        <Table>
          <TableHeader>
            <tr className="text-gray-700 dark:text-gray-200">
              <TableCell>Date</TableCell>
              <TableCell>Teacher</TableCell>
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
                      <span className="text-sm">{attendance.teacher_name}</span>
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

export default TeacherAttendance;
