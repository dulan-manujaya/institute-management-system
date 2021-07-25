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
import variables from "../../common/globalVariables";
import PageTitle from "../../components/Typography/PageTitle";
import SectionTitle from "../../components/Typography/SectionTitle";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Results = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);

  const [resultsResponse, setResultResponse] = useState([]);
  const totalResults = resultsResponse.length;
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsData, setResultsData] = useState([]);

  const [marksFilter, setMarksFilter] = useState("All");
  const [courseId, setCourseId] = useState("All");
  const [courseName, setCourseName] = useState("All");
  const [studentId, setStudentId] = useState("All");
  const [studentName, setStudentName] = useState("All");
  const [examId, setExamId] = useState("All");
  const [examName, setExamName] = useState("All");

  const resultsPerPage = 10;

  function onResultsPageChange(p) {
    setResultsPage(p);
  }

  const getAllResults = async () => {
    try {
      var results = await axios.post(
        `${variables.apiServer}/api/v1/results/all`,
        {
          studentId: studentId,
          courseId: courseId,
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
      if (examId != "All") {
        results.data = results.data.filter(
          (result) => result.exam_id == examId
        );
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

  const getAllExams = async () => {
    const exams = await axios.get(`${variables.apiServer}/api/v1/exams/`, {});
    setExams(exams.data);
  };

  useEffect(() => {
    getAllResults();
    getAllCourses();
    getAllStudents();
    getAllExams();
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
    console.log(examName);
    console.log(examId);
    var sum = 0;
    for (var i = 0; i < resultsResponse.length; i++) {
      sum += parseInt(resultsResponse[i].marks, 10); //don't forget to add the base
    }
    var avg = sum / resultsResponse.length;

    const doc = new jsPDF({ orientation: "landscape" });
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
    doc.text("Student Results", 15, 15);

    doc.setFontSize(15);
    doc.text(`Mark Range : ${marksFilter}`, 15, 30);
    doc.text(`Course : ${courseName == null ? courseId : courseName}`, 15, 40);
    doc.text(
      `Student : ${studentName == null ? studentId : studentName}`,
      15,
      50
    );
    doc.text(`Exam : ${examName == null ? examId : examName}`, 15, 60);
    doc.text(
      `No. of Students : ${studentName == "All" ? students.length : 1}`,
      15,
      70
    );
    doc.text(
      `Highest Mark : ${Math.max.apply(
        Math,
        resultsResponse.map((result) => {
          return result.marks;
        })
      )}`,
      15,
      80
    );
    doc.text(`Average Mark : ${avg}`, 15, 90);
    doc.autoTable(col, rows, {
      startY: 100,
      didDrawPage: function (data) {
        doc.setFontSize(10);
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        doc.text(
          `Benchmark Education Institute - Matara`,
          220,
          pageHeight - 10
        );
      },
    });
    doc.save("Student Results.pdf");
  };

  return (
    <>
      <PageTitle>Student Results</PageTitle>
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
                key={i}
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
                student_name={`${student.first_name} ${student.last_name}`}
              >
                {student.first_name} {student.last_name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <SectionTitle>Exams</SectionTitle>
          <Select
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
            onChange={(e) => {
              setExamId(e.target.value);
              setExamName(
                e.target.options[e.target.selectedIndex].getAttribute(
                  "exam_name"
                )
              );
            }}
          >
            <option key={"-1"}>All</option>
            {!exams
              ? null
              : exams.map((exam, i) => (
                  <option
                    key={exam.exam_id}
                    value={exam.exam_id}
                    exam_name={exam.exam_name}
                  >
                    {exam.exam_name}
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
