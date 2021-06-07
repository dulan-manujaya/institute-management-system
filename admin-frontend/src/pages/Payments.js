import React, { useState, useEffect } from "react";
import axios from "axios";

import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import variables from "../common/globalVariables";
import {
  doughnutOptions,
  lineOptions,
  barOptions,
  doughnutLegends,
  lineLegends,
  barLegends,
} from "../utils/demo/chartsData";
import {
  Input,
  Button,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Avatar,
  Pagination,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";

function Charts() {
  const [studentId, setStudentId] = useState(0);
  const [student, setStudent] = useState("");
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [enrollmentTable, setEnrollmentTable] = useState(1);
  const [enrollCount, setEnrollmentCount] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  const [selectedCourseAmount, setSelectedCourseAmount] = useState("");
  const resultsPerPage = 2;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthString, setMonthString] = useState("");
  const [monthPaying, setMonthPaying] = useState("");
  const [year, setYear] = useState("");

  const initialPaymentBody = {
    enrollment_id: selectedEnrollmentId,
    paid_for_month: monthPaying,
    paid_for_year: year,
  };

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  var d = new Date();
  var n = d.getMonth();

  const getStudentById = async (id) => {
    try {
      const response = await axios.get(
        `${variables.apiServer}/api/v1/students/id/${id}`
      );
      console.log(response.data);
      setStudent(response.data);
    } catch (err) {}
  };

  const checkPaymentStatus = async () => {};

  const markPayment = async () => {
    const token = sessionStorage.getItem("adminAccessToken");
    try {
      const response = await axios.post(
        `${variables.apiServer}/api/v1/payments`,
        initialPaymentBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      window.location.reload();
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  const getStudentEnrollments = async (id) => {
    try {
      const enrollments = await axios.get(
        `${variables.apiServer}/api/v1/enrollments/student/${id}`
      );
      setStudentEnrollments(
        enrollments.data.slice(
          (enrollmentTable - 1) * resultsPerPage,
          enrollmentTable * resultsPerPage
        )
      );
      setEnrollmentCount(enrollments.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  function onSearch(id) {
    getStudentById(id);
    getStudentEnrollments(id);
  }

  const getMonthString = (num) => {
    var month;
    switch (num) {
      case 0:
        month = "January";
        break;
      case 1:
        month = "February";
        break;
      case 2:
        month = "March";
        break;
      case 3:
        month = "April";
        break;
      case 4:
        month = "May";
        break;
      case 5:
        month = "June";
        break;
      case 6:
        month = "July";
        break;
      case 7:
        month = "August";
        break;
      case 8:
        month = "September";
        break;
      case 9:
        month = "October";
        break;
      case 10:
        month = "November";
        break;
      case 11:
        month = "December";
        break;
      default:
        month = "Invalid month";
    }
    setMonthString(month);
  };

  function onPageChangeEnrollmentTable(p) {
    setEnrollmentTable(p);
  }

  useEffect(() => {}, [enrollmentTable]);

  return (
    <>
      <PageTitle>Payments</PageTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-1">
        <ChartCard title="Mark New Payment">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex pr-4 mb-4">
              <div className="relative max-w-md">
                <Input
                  type="number"
                  onChange={(e) => {
                    setStudentId(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg shadow focus:outline-none focus:shadow-outline text-gray-400 font-medium"
                  placeholder="Enter Student ID"
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
            <div className="flex-1 pr-4 mb-4">
              <Button onClick={() => onSearch(studentId)}>Search</Button>
            </div>
          </div>
          <div className="relative p-px overflow-hidden transition duration-300 transform border rounded shadow-sm group hover:shadow-xl">
            <div className="absolute bottom-0 left-0 w-full h-1 duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
            <div className="absolute bottom-0 left-0 w-1 h-full duration-300 origin-bottom transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100" />
            <div className="absolute top-0 left-0 w-full h-1 duration-300 origin-right transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
            <div className="absolute bottom-0 right-0 w-1 h-full duration-300 origin-top transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100" />
            <div className="relative p-5 bg-gray-800 rounded-sm">
              {!student ? null : (
                <div>
                  <div className="flex flex-col mb-2 lg:items-center lg:flex-row">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={student.avatar}
                      alt="User avatar"
                    />

                    <h6 className="font-semibold text-white leading-5">
                      {student.first_name} {student.last_name}
                    </h6>
                  </div>
                  {!studentEnrollments ? null : (
                    <TableContainer className="mb-8">
                      <Table>
                        <TableHeader>
                          <tr className="text-white">
                            <TableCell>Course</TableCell>
                            <TableCell>Registered Date</TableCell>
                            <TableCell>Last Paid For</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </tr>
                        </TableHeader>
                        <TableBody>
                          {!studentEnrollments
                            ? null
                            : studentEnrollments.map((enrollment, i) => (
                                <TableRow key={i}>
                                  <TableCell>
                                    <span className="text-sm">
                                      {enrollment.course_name}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <p className="text-sm">
                                      {new Date(
                                        enrollment.enrolled_date
                                      ).toLocaleDateString()}
                                    </p>
                                  </TableCell>
                                  <TableCell>
                                    <p className="text-sm">
                                      {!enrollment.month_name
                                        ? "-"
                                        : enrollment.month_name}{" "}
                                      {enrollment.paid_for_year}
                                    </p>
                                  </TableCell>
                                  <TableCell>
                                    {n > enrollment.paid_for_month ? (
                                      <Badge type="danger">Due</Badge>
                                    ) : (
                                      <Badge type="success">Paid</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-4">
                                      {n > enrollment.paid_for_month ? (
                                        <Button
                                          onClick={() => {
                                            setSelectedEnrollmentId(
                                              enrollment.enrollment_id
                                            );
                                            setSelectedCourse(
                                              enrollment.course_name
                                            );
                                            setSelectedCourseAmount(
                                              enrollment.amount
                                            );
                                            setMonthPaying(
                                              enrollment.paid_for_month + 1
                                            );
                                            getMonthString(
                                              enrollment.paid_for_month + 1
                                            );
                                            setYear(enrollment.paid_for_year);
                                            openModal();
                                          }}
                                          size="small"
                                        >
                                          Record Payment
                                        </Button>
                                      ) : (
                                        <Button disabled size="small">
                                          Record Payment
                                        </Button>
                                      )}

                                      <Button size="small">
                                        Pause Membership
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                        </TableBody>
                      </Table>
                      <TableFooter>
                        <Pagination
                          totalResults={enrollCount}
                          resultsPerPage={resultsPerPage}
                          onChange={onPageChangeEnrollmentTable}
                          label="Table navigation"
                        />
                      </TableFooter>
                    </TableContainer>
                  )}
                  <a
                    href="/"
                    aria-label=""
                    className="inline-flex items-center text-sm font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
                  >
                    Learn more
                  </a>
                </div>
              )}
            </div>
          </div>
        </ChartCard>
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Doughnut">
          <Doughnut {...doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>

        <ChartCard title="Lines">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>

        <ChartCard title="Bars">
          <Bar {...barOptions} />
          <ChartLegend legends={barLegends} />
        </ChartCard>
      </div>

      {/* Payment Model */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>
          {student.first_name} {student.last_name}
        </ModalHeader>
        <ModalBody>
          <p className="text-sm">
            {selectedCourse} - LKR {selectedCourseAmount}
          </p>
          <p className="text-sm">
            Paying For: {monthString} - {year}
          </p>
        </ModalBody>
        <ModalFooter>
          {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={() => markPayment()}>Mark as Paid</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large">
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Charts;
