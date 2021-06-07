import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Pagination,
  Select,
  Button,
} from "@windmill/react-ui";
import variables from "../common/globalVariables";
import { TeacherContext } from "../context/Context.Index";

import PageTitle from "../components/Typography/PageTitle";
import { TrashIcon } from "../icons";

function Students() {
  const { loggedInUser } = useContext(TeacherContext);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [response, setResponse] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [courseId, setCourseId] = useState("");

  const resultsPerPage = 9;

  const onPageChange = (p) => {
    setPage(p);
  };

  const getAllStudents = async () => {
    try {
      const students = await axios.get(
        `${variables.apiServer}/api/v1/students`
      );
      setResponse(students.data);
      setData(
        students.data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      setTotalResults(response.length);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStudent = async (id) => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .delete(`${variables.apiServer}/api/v1/students/id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        getAllStudents();
      });
  };

  var numberOfAjaxCAllPending = 0;

  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      numberOfAjaxCAllPending++;
      // show loader
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      numberOfAjaxCAllPending--;
      console.log("------------  Ajax pending", numberOfAjaxCAllPending);

      if (numberOfAjaxCAllPending === 0) {
        //hide loader
      }
      return response;
    },
    function (error) {
      numberOfAjaxCAllPending--;
      if (numberOfAjaxCAllPending === 0) {
        //hide loader
      }
      return Promise.reject(error);
    }
  );

  // const getStudentsByCourse = async (id) => {
  //   try {
  //     const students = await axios.get(
  //       `${variables.apiServer}/api/v1/students/course/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${loggedInUser.token}`,
  //         },
  //       }
  //     );
  //     setResponse(students.data);
  //     setData(
  //       students.data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
  //     );
  //     setTotalResults(response.length);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const courseSelect = (e) => {
  //   setCourseId(e.target.value);
  //   getStudentsByCourse(e.target.value);
  // };

  const clearFilters = () => {
    setCourseId(-1);
  };

  useEffect(() => {
    getAllStudents();
  }, [page, loggedInUser]);

  return (
    <>
      <PageTitle>Students</PageTitle>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex-1 pr-4 mb-4">
          <div className="relative max-w-md">
            <input
              type="search"
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow focus:outline-none focus:shadow-outline text-gray-600 font-medium placeholder-gray-600 dark:placeholder-gray-400"
              placeholder="Search..."
            />
            <div className="absolute top-0 left-0 inline-flex items-center p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-400"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x={0} y={0} width={24} height={24} stroke="none" />
                <circle cx={10} cy={10} r={7} />
                <line x1={21} y1={21} x2={15} y2={15} />
              </svg>
            </div>
          </div>
        </div>

        {/* <div className="flex-1 pr-4 mb-4">
          <Select
            disabled={!gradeSelected}
            className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
            onChange={(e) => {
              courseSelect(e);
            }}
            value={courseId}
          >
            <option value={-1}>Select Course</option>
            {!courses
              ? null
              : courses.map((course) => (
                  <option value={course.course_id} key={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
          </Select>
        </div> */}
        <div className="mb-4">
          <Button
            onClick={() => {
              clearFilters();
              getAllStudents();
            }}
          >
            Clear Filters / Refresh List
          </Button>
        </div>
      </div>
      {!data ? (
        <button type="button" className="bg-rose-600 ..." disabled>
          <svg
            className="animate-spin h-5 w-5 mr-3 ..."
            viewBox="0 0 24 24"
          ></svg>
          Processing
        </button>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Student</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Registered Date</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {data.map((user, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Avatar
                        className="hidden mr-3 md:block"
                        src={user.avatar}
                      />
                      <div>
                        <Link to={`/app/student-details/${user.student_id}`}>
                          <p className="font-semibold">
                            {user.first_name} {user.last_name}
                          </p>
                        </Link>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.mobile}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(user.registered_date).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/app/student-details/${user.student_id}`}>
                      <Button className="mr-4" size="small">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => {
                        deleteStudent(user.student_id);
                      }}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
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
              onChange={onPageChange}
            />
          </TableFooter>
        </TableContainer>
      )}
    </>
  );
}

export default Students;
