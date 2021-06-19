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
  Button,
} from "@windmill/react-ui";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import variables from "../../../common/globalVariables";
import PageTitle from "../../../components/Typography/PageTitle";
import SectionTitle from "../../../components/Typography/SectionTitle";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Results = () => {
  const [parentId, setParentId] = useState("0");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [resultsResponse, setResultResponse] = useState([]);
  const totalResults = resultsResponse.length;
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsData, setResultsData] = useState([]);

  const [marksFilter, setMarksFilter] = useState("All");
  const [courseId, setCourseId] = useState("All");
  const [courseName, setCourseName] = useState("All");
  const [studentId, setStudentId] = useState("All");
  const [studentName, setStudentName] = useState("All");

  const resultsPerPage = 10;

  function onResultsPageChange(p) {
    setResultsPage(p);
  }

  const getAllResults = async () => {
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
      setParentId(pid);
      var results = await axios.post(
        `${variables.apiServer}/api/v1/results/parent/${pid}`,
        {
          studentId: studentId,
          courseId: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (marksFilter != "All") {
        if (marksFilter == "<50") {
          results.data = results.data.filter((result) => result.marks < 50);
        }
        if (marksFilter == ">50") {
          results.data = results.data.filter((result) => result.marks >= 50);
        }
        if (marksFilter == ">75") {
          results.data = results.data.filter((result) => result.marks >= 75);
        }
      }
      setResultsData(
        results.data.slice(
          (resultsPage - 1) * resultsPerPage,
          resultsPage * resultsPerPage
        )
      );
      setResultResponse(results.data);
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
    setParentId(pid);
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
    setParentId(pid);
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
    getAllResults();
    getAllCourses();
    getAllStudents();
  }, [resultsPage]);

  useEffect(() => {
    setResultsData(
      resultsResponse.slice(
        (resultsPage - 1) * resultsPerPage,
        resultsPage * resultsPerPage
      )
    );
  }, [resultsPage]);

  const generatePDF = () => {
    const doc = new jsPDF();
    var col = ["Course", "Exam", "Student", "Marks"];
    var rows = [];
    resultsResponse.map((item) => {
      rows.push([
        item.course_name,
        item.exam_name,
        item.student_name,
        item.marks,
      ]);
    });
    doc.setFontSize(40);
    doc.text("Parent - Student Results", 15, 15);

    doc.setFontSize(16);
    doc.text(`Mark Range : ${marksFilter}`, 15, 30);
    doc.text(`Course : ${courseName == null ? courseId : courseName}`, 15, 40);
    doc.text(
      `Student : ${studentName == null ? studentId : studentName}`,
      15,
      50
    );
    doc.autoTable(col, rows, { startY: 60 });
    doc.save("Parent - Student Results.pdf");
  };

  return (
    <>
      <PageTitle>Results</PageTitle>
      <div className="grid grid-cols-3 gap-4 mb-4">
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
                key={enrollment.enrollment_id}
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
        <div>
          <SectionTitle>Mark Range</SectionTitle>
          <Select
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
            onChange={(e) => {
              setMarksFilter(e.target.value);
            }}
          >
            <option key="-1">All</option>
            <option key="1" value="<50">
              Below 50
            </option>
            <option key="2" value=">50">
              Above 50
            </option>
            <option key="3" value=">75">
              Above 75
            </option>
          </Select>
        </div>
      </div>
      <Button onClick={() => getAllResults()} className="my-4 w-1/4">
        Apply Filters
      </Button>
      <TableContainer className="mb-4">
        <Table>
          <TableHeader>
            <tr className="text-gray-700 dark:text-gray-200">
              <TableCell>Course</TableCell>
              <TableCell>Exam</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Marks</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {!resultsData
              ? null
              : resultsData.map((result, i) => (
                  <TableRow
                    key={i}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <TableCell>
                      <span className="text-sm">{result.course_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{result.exam_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{result.student_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{result.marks}</span>
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

export default Results;
