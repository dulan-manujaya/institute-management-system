import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import PageTitle from "../components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Avatar,
  Button,
  Pagination,
} from "@windmill/react-ui";
import { TrashIcon, CheckIcon } from "../icons";

// const response2 = response.concat([]);
// make a copy of the data, for the second table

function PendingStudents() {
  const [pageTable2, setPageTable2] = useState(1);
  const [dataTable2, setDataTable2] = useState([]);
  const [response2, setResponse2] = useState();

  const approveBody = {
    is_approved: true,
  };

  // pagination setup
  const resultsPerPage = 10;
  const [noOfPendingStudents, setNoOfPendingStudents] = useState("");

  // pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  const approveStudent = async (student_id) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.patch(
        "http://localhost:4000/api/v1/students/id/" + `${student_id}`,
        approveBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStudent = async (student_id) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.delete(
        "http://localhost:4000/api/v1/students/id/" + `${student_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllPendingStudents = async () => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const students = await axios.get(
        "http://localhost:4000/api/v1/students/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(students);
      setResponse2(students.data);
      setDataTable2(
        students.data.slice(
          (pageTable2 - 1) * resultsPerPage,
          pageTable2 * resultsPerPage
        )
      );
      // console.log(response3);
      setNoOfPendingStudents(students.data.length);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getAllPendingStudents();
  }, [pageTable2]);

  if (!dataTable2) {
    return (
      <div className="flex flex-col items-center">
        {/* <ForbiddenIcon
          className="w-12 h-12 mt-8 text-purple-200"
          aria-hidden="true"
        /> */}
        <h1 className="text-6xl font-semibold text-gray-700 dark:text-gray-200">
          No Pending Students!
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          <Link
            onClick={() => window.location.reload()}
            className="text-purple-600 hover:underline dark:text-purple-300"
            to="/app/dashboard"
          >
            Refresh
          </Link>
          {" or "}
          <Link
            className="text-purple-600 hover:underline dark:text-purple-300"
            to="/app/dashboard"
          >
            Go back to Dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <PageTitle>Pending Students</PageTitle>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Registered Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable2.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={user.avatar}
                      alt="User avatar"
                    />
                    <div>
                      <p className="font-semibold">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.grade_name}</span>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{user.mobile}</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(user.registered_date).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                      onClick={() => approveStudent(user.student_id)}
                    >
                      <CheckIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => deleteStudent(user.student_id)}
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={noOfPendingStudents}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default PendingStudents;
