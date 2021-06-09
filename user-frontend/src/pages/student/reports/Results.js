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
} from "@windmill/react-ui";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import variables from "../../../common/globalVariables";
import PageTitle from "../../../components/Typography/PageTitle";
import SectionTitle from "../../../components/Typography/SectionTitle";

const Results = () => {
  const [studentId, setStudentId] = useState("0");
  const [enrollments, setEnrollments] = useState([]);

  const [resultsResponse, setResultResponse] = useState([]);
  const totalResults = resultsResponse.length;
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsData, setResultsData] = useState([]);

  const [marksFilter, setMarksFilter] = useState("All");
  const [courseId, setCourseId] = useState("All");

  const resultsPerPage = 10;

  function onResultsPageChange(p) {
    setResultsPage(p);
  }

  const getAllResults = async () => {
    try {
      const token = sessionStorage.getItem("studentAccessToken");
      const currStudent = await axios.get(
        `${variables.apiServer}/api/v1/students/whoami`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sid = currStudent.data.student_id;
      setStudentId(sid);
      const results = await axios.get(
        `${variables.apiServer}/api/v1/results/student/${sid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const getAllEnrollments = async () => {
    const token = sessionStorage.getItem("studentAccessToken");
    const currStudent = await axios.get(
      `${variables.apiServer}/api/v1/students/whoami`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const sid = currStudent.data.student_id;
    setStudentId(sid);
    const enrollments = await axios.get(
      `${variables.apiServer}/api/v1/enrollments/student/${sid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setEnrollments(enrollments.data);
  };

  const dynamicSearch = () => {
    console.log(courseId)
    console.log(marksFilter)
    if (courseId == "All") {
      if (marksFilter == "All") {
        return resultsData;
      }
      if (marksFilter == "<50") {
        return resultsData.filter((result) => result.marks < 50);
      }
      if (marksFilter == ">50") {
        return resultsData.filter((result) => result.marks >= 50);
      }
      if (marksFilter == ">75") {
        return resultsData.filter((result) => result.marks >= 75);
      }
    } else {
      if (marksFilter == "All") {
        return resultsData.filter((result) => result.course_id == courseId);
      }
      if (marksFilter == "<50") {
        return resultsData.filter(
          (result) => result.course_id == courseId && result.marks < 50
        );
      }
      if (marksFilter == ">50") {
        return resultsData.filter(
          (result) => result.course_id == courseId && result.marks >= 50
        );
      }
      if (marksFilter == ">75") {
        return resultsData.filter(
          (result) => result.course_id == courseId && result.marks >= 75
        );
      }
    }
  };

  useEffect(() => {
    getAllResults();
    getAllEnrollments();
  }, [resultsPage]);

  useEffect(() => {
    setResultsData(
      resultsResponse.slice(
        (resultsPage - 1) * resultsPerPage,
        resultsPage * resultsPerPage
      )
    );
  }, [resultsPage]);
  return (
    <>
      <PageTitle>Results</PageTitle>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <SectionTitle>Courses</SectionTitle>
          <Select
            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
            onChange={(e) => {
              setCourseId(e.target.value);
            }}
          >
            <option key={"-1"}>
              All
            </option>
            {enrollments.map((enrollment, i) => (
              <option
                key={enrollment.enrollment_id}
                value={enrollment.course_id}
              >
                {enrollment.course_name}
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
      <TableContainer className="mb-4">
        <Table>
          <TableHeader>
            <tr className="text-gray-700 dark:text-gray-200">
              <TableCell>Course</TableCell>
              <TableCell>Exam</TableCell>
              <TableCell>Marks</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {!dynamicSearch()
              ? null
              : dynamicSearch().map((result, i) => (
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
    </>
  );
};

export default Results;
