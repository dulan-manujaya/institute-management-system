import {
  Avatar,
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow
} from "@windmill/react-ui";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import variables from "../common/globalVariables";
import PageTitle from "../components/Typography/PageTitle";
import { TeacherContext } from "../context/Context.Index";
import { TrashIcon } from "../icons";
import ToastMessage from "../messages/HandleMessages";

const PendingEnrollments = () => {
  const { loggedInUser } = useContext(TeacherContext);
  const [enrollmentPendingTable, setEnrollmentPendingTable] = useState(1);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [noOfPendingEnrollments, setNoOfPendingEnrollments] = useState("");
  const today = new Date(Date.now());
  const pendingResultsPerPage = 10;

  const enrollAcceptBody = {
    is_accepted: true,
  };

  const onPageChangeEnrollmentPendingTable = (p) => {
    setEnrollmentPendingTable(p);
  };

  const getAllPendingEnrollments = async () => {
    try {
      const enrollments = await axios.get(
        `${variables.apiServer}/api/v1/enrollments/pending/${loggedInUser.teacher_id}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setEnrollmentData(
        enrollments.data.slice(
          (enrollmentPendingTable - 1) * pendingResultsPerPage,
          enrollmentPendingTable * pendingResultsPerPage
        )
      );
      setNoOfPendingEnrollments(enrollments.data.length);
    } catch (err) {
      console.log(err.message);
    }
  };

  const acceptEnrollment = async (enrollment_id) => {
    await axios
      .patch(
        `${variables.apiServer}/api/v1/enrollments/id/${enrollment_id}`,
        enrollAcceptBody,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      )
      .then((response) => {
        initialPayment(enrollment_id);
        ToastMessage(response.data.message);
        getAllPendingEnrollments();
      })
      .catch((error) => {
        console.log(error.response.data);
        ToastMessage(error.response.data.message);
      });
  };

  const deleteEnrollment = async (enrollment_id) => {
    await axios
      .delete(`${variables.apiServer}/api/v1/enrollments/id/${enrollment_id}`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      })
      .then((response) => {
        ToastMessage(response.data);
        getAllPendingEnrollments();
      })
      .catch((error) => {
        console.log(error);
        ToastMessage(error.response.data.message);
      });
  };

  const initialPayment = async (enrl_id) => {
    await axios
      .post(
        `${variables.apiServer}/api/v1/payments`,
        {
          enrollment_id: enrl_id,
          paid_for_month: today.getMonth(),
          paid_for_year: today.getFullYear(),
        },
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      )
      .then((response) => {
        ToastMessage(response.data);
      })
      .catch((error) => {
        console.log(error);
        ToastMessage(error.response.data.message);
      });
  };

  useEffect(() => {
    getAllPendingEnrollments();
  }, [enrollmentPendingTable, loggedInUser]);

  return (
    <>
      <div className="tabview">
        <div className="card">
          <PageTitle>Course Enrollments</PageTitle>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr className="text-gray-600 dark:text-gray-200">
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
                              onClick={() => {
                                deleteEnrollment(enrollment.enrollment_id);
                              }}
                            >
                              <TrashIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
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
                resultsPerPage={pendingResultsPerPage}
                onChange={onPageChangeEnrollmentPendingTable}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default PendingEnrollments;
