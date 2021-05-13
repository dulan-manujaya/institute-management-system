import React, { useState, useEffect } from "react";
import axios from "axios";
import variables from "../common/globalVariables";
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

function PendingStudents() {
  const [enrollmentTable, setEnrollmentTable] = useState(1);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [dataTable2, setDataTable2] = useState([]);

  var d = new Date();
  var n = d.getMonth();

  const enrollAcceptBody = {
    is_accepted: true,
  };

  const initialPaymentBody = {
    enrollment_id: "",
    paid_for_month: "",
    paid_for_year: "",
  };

  // pagination setup
  const resultsPerPage = 10;
  const [noOfPendingEnrollments, setNoOfPendingEnrollments] = useState("");

  // pagination change control
  function onPageChangeEnrollmentTable(p) {
    setEnrollmentTable(p);
  }

  const getTeacherId = async () => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const currTeacher = await axios.get(
        `${variables.apiServer}/api/v1/teachers/whoami`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const tid = currTeacher.data.teacher_id;
      setTeacherId(tid);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllPendingEnrollments = async () => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const enrollments = await axios.get(
        `${variables.apiServer}/api/v1/enrollments/pending/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnrollmentData(
        enrollments.data.slice(
          (enrollmentTable - 1) * resultsPerPage,
          enrollmentTable * resultsPerPage
        )
      );
      setNoOfPendingEnrollments(enrollments.data.length);
    } catch (err) {
      console.log(err.message);
    }
  };

  const markInitialPayment = async (stu_id) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.post(
        `${variables.apiServer}/api/v1/students/id/${stu_id}`,
        initialPaymentBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const acceptEnrollment = async (enrollment_id) => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.patch(
        `${variables.apiServer}/api/v1/enrollments/id/${enrollment_id}`,
        enrollAcceptBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTeacherId();
    if (teacherId !== "") {
      getAllPendingEnrollments();
    }
  }, [teacherId, enrollmentTable]);

  return (
    <>
      <PageTitle>New Enrollments</PageTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr className="text-white">
              <TableCell>Student</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Enrollment Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {!enrollmentData
              ? null
              : enrollmentData.map((enrollment, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="hidden mr-3 md:block"
                          src={enrollment.avatar}
                          alt="User avatar"
                        />
                        <div>
                          <p className="font-semibold">
                            {enrollment.first_name} {enrollment.last_name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {enrollment.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{enrollment.course_name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{enrollment.grade_name}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(
                          enrollment.enrolled_date
                        ).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button
                          size="small"
                          onClick={() =>
                            acceptEnrollment(enrollment.enrollment_id)
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          // onClick={() => deleteStudent(enrollment.student_id)}
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
            totalResults={noOfPendingEnrollments}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeEnrollmentTable}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default PendingStudents;
