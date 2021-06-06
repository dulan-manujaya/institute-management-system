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
import { TeacherContext, GradeContext } from "../context/Context.Index";
import { TrashIcon } from "../icons";

import PageTitle from "../components/Typography/PageTitle";

function Teachers() {
  const { loggedInUser } = useContext(TeacherContext);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [response, setResponse] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  const resultsPerPage = 9;

  const onPageChange = (p) => {
    setPage(p);
  };

  const deleteTeacher = async (id) => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .delete(`${variables.apiServer}/api/v1/teachers/id/${id}`, {
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
        getAllTeachers();
      });
  };

  const getAllTeachers = async () => {
    try {
      const token = sessionStorage.getItem("adminAccessToken");
      const teachers = await axios.get(
        `${variables.apiServer}/api/v1/teachers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(teachers.data);
      setData(
        teachers.data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      setTotalResults(response.length);
    } catch (err) {
      console.log(err);
    }
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
  //     const teachers = await axios.get(
  //       `${variables.apiServer}/api/v1/teachers/course/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${loggedInUser.token}`,
  //         },
  //       }
  //     );
  //     setResponse(teachers.data);
  //     setData(
  //       teachers.data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
  //     );
  //     setTotalResults(response.length);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const clearFilters = () => {
  //   setCourseId(-1);
  //   setGradeId(-1);
  // };

  useEffect(() => {
    getAllTeachers();
  }, [page, loggedInUser]);
  return (
    <>
      <PageTitle>Teachers</PageTitle>
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

        <div className="mb-4">
          <Button
            onClick={() => {
              // clearFilters();
              getAllTeachers();
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
                <TableCell>Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {data.map((teacher, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">
                          {teacher.first_name + " " + teacher.last_name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {teacher.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{teacher.mobile}</span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/app/edit-teacher/${teacher.teacher_id}`}>
                      <Button className="mr-4" size="small">
                        Edit
                      </Button>
                    </Link> 
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => {
                        deleteTeacher(teacher.teacher_id);
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

export default Teachers;
