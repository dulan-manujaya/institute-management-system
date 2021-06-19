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

const PaymentsReports = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [paymentsResponse, setattendanceResponse] = useState([]);
  const totalResults = paymentsResponse.length;
  const [paymentsPage, setAttendancePage] = useState(1);
  const [attendanceData, setAttendanceData] = useState([]);

  // const [fromDate, setFromDate] = useState(new Date("10/23/2015"));
  // const [toDate, setToDate] = useState(new Date());

  const [courseId, setCourseId] = useState("All");
  const [studentId, setStudentId] = useState("All");

  const resultsPerPage = 10;

  function onResultsPageChange(p) {
    setAttendancePage(p);
  }

  const getAllPayments = async () => {
    try {
      const token = sessionStorage.getItem("adminAccessToken");
      var payments = await axios.get(
        `${variables.apiServer}/api/v1/payments/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(payments);
      if (studentId != "All") {
        payments.data = payments.data.filter(
          (payments) => payments.student_id == studentId
        );
      }
      setAttendanceData(
        payments.data.slice(
          (paymentsPage - 1) * resultsPerPage,
          paymentsPage * resultsPerPage
        )
      );
      setattendanceResponse(payments.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllCourses = async () => {
    const token = sessionStorage.getItem("adminAccessToken");

    const courses = await axios.get(`${variables.apiServer}/api/v1/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCourses(courses.data);
  };

  const getAllStudents = async () => {
    const token = sessionStorage.getItem("adminAccessToken");
    const students = await axios.get(`${variables.apiServer}/api/v1/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setStudents(students.data);
  };

  useEffect(() => {
    getAllPayments();
    getAllCourses();
    getAllStudents();
  }, [paymentsPage]);

  useEffect(() => {
    setAttendanceData(
      paymentsResponse.slice(
        (paymentsPage - 1) * resultsPerPage,
        paymentsPage * resultsPerPage
      )
    );
  }, [paymentsPage]);

  const generatePDF = () => {
    const doc = new jsPDF();
    var col = ["Date", "Course", "Student"];
    var rows = [];
    paymentsResponse.map((item) => {
      rows.push([
        new Date(item.att_date).toLocaleDateString(),
        item.course_name,
        item.first_name + " " + item.last_name,
      ]);
    });
    doc.autoTable(col, rows);
    doc.save("Payments.pdf");
  };

  return (
    <>
      <PageTitle>Student Payments</PageTitle>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <SectionTitle>Students</SectionTitle>
          <Select
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
            onChange={(e) => {
              setStudentId(e.target.value);
            }}
          >
            <option key={"-1"}>All</option>
            {students.map((student, i) => (
              <option key={student.student_id} value={student.student_id}>
                {student.first_name} {student.last_name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <Button onClick={() => getAllPayments()} className="my-4 w-1/4">
        Apply Filters
      </Button>
      <TableContainer className="mb-4">
        <Table>
          <TableHeader>
            <tr className="text-gray-700 dark:text-gray-200">
              <TableCell>Paid Date</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Paid For</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {!attendanceData
              ? null
              : attendanceData.map((payments, i) => (
                  <TableRow
                    key={i}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <TableCell>
                      <span className="text-sm">
                        {new Date(payments.paid_date).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{payments.course_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {payments.first_name} {payments.last_name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {payments.paid_for_month}/{payments.paid_for_year}
                      </span>
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

export default PaymentsReports;
