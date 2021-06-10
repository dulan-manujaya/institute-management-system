import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Pagination,
  Button,
  Label,
} from "@windmill/react-ui";

import PageTitle from "../components/Typography/PageTitle";
import variables from "../common/globalVariables";

const MarkAttendance = () => {
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const resultsPerPage = 9;

  const getCourses = async () => {
    await axios
      .get(`${variables.apiServer}/api/v1/courses`)
      .then((response) => {
        console.log(response);
        setCourses(response.data);
      });
  };

  const markAsAttended = async (id) => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .post(
        `${variables.apiServer}/api/v1/attendance`,
        {
          course_id: courseId,
          student_id: id,
          att_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const getStudentsByCourse = async (id) => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .get(`${variables.apiServer}/api/v1/students/course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data) {
          setData(response.data);
          setTotalResults(response.data.length);
        } else {
          setData([]);
          setTotalResults(0);
        }
      })
      .catch((error) => {
        console.log(error);
        setData([]);
        setTotalResults(0);
      });
  };

  const onPageChange = (p) => {
    setPage(p);
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    setStudents(data.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page, data]);

  useEffect(() => {
    getStudentsByCourse(courseId);
  }, [courseId]);

  return (
    <>
      <PageTitle>Mark Attendance</PageTitle>
      <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 flex flex-col my-2 dark:bg-gray-800">
        <div className="-mx-3 md:flex mb-6">
          <div className="md:w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
              htmlFor="grid-course-amount"
            >
              Course
            </label>
            <Select
              className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
              id="grid-course"
              onChange={(e) => {
                setCourseId(e.target.value);
              }}
              value={courseId}
            >
              <option>Select Course</option>
              {courses.map((course, i) => (
                <option key={i} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </Select>
            {/* {!submitted ? null : !studentLastName ? <FormFillError /> : null} */}
          </div>
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
              htmlFor="grid-exam-name"
            >
              Date
            </label>
            <Label className="font-bold text-white text-2xl">
              {new Date().toLocaleDateString()}
            </Label>
          </div>
        </div>
      </div>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          {data ? (
            <TableBody>
              {students.map((student, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <span className="text-sm">
                      {student.first_name} {student.last_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        markAsAttended(student.student_id);
                      }}
                      className="mr-4"
                      size="small"
                    >
                      Mark As Attended
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : null}
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </>
  );
};

export default MarkAttendance;
