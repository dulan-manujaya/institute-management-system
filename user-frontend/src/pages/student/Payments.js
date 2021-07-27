import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import variables from "../../common/globalVariables";
import PageTitle from "../../components/Typography/PageTitle";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StripeContainer } from "../../components/StripeContainer";

const Payments = () => {
  const [studentId, setStudentId] = useState("0");
  const [enrollments, setEnrollments] = useState([]);
  const [latestPayment, setLatestPayment] = useState();
  const [enrollmentId, setEnrollmentId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState("");
  const [selectedEnrl, setSelectedEnrl] = useState("");
  const resultsPerPage = 10;
  const totalResults = payments.length;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [response, setResponse] = useState([]);
  const monthNames = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function onPageChange(p) {
    setPage(p);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const alert = (message, type) => {
    console.log(type);
    console.log(message);
    toast(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      type: type,
    });
  };

  const getAllPayments = async () => {
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
      const payments = await axios.get(
        `${variables.apiServer}/api/v1/payments/getByStudentId/${sid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(payments.data);
      setData(
        payments.data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      setPayments(payments.data);
      // setTotalResults(submissions.data.length);
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

  const setLastPaidDate = async (course_Id) => {
    let enrollment = enrollments.find((e) => e.course_id == course_Id);
    setEnrollmentId(enrollment.enrollment_id);
    setSelectedEnrl(enrollment);

    const token = sessionStorage.getItem("studentAccessToken");
    await axios
      .post(
        `${variables.apiServer}/api/v1/payments/getLatestPaymentDate/`,
        {
          course_id: course_Id,
          student_id: studentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLatestPayment(response.data);
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  const createPayment = async (course_Id) => {
    const token = sessionStorage.getItem("studentAccessToken");
    await axios
      .post(
        `${variables.apiServer}/api/v1/payments/`,
        {
          enrollment_id: enrollmentId,
          paid_for_month:
            latestPayment.paid_for_month + 1 == 13
              ? 1
              : latestPayment.paid_for_month + 1,
          paid_for_year:
            latestPayment.paid_for_month + 1 == 13
              ? latestPayment.paid_for_year + 1
              : latestPayment.paid_for_year,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert(response.data, "success");
        closeModal();
        setLatestPayment("");
        getAllPayments();
        getAllEnrollments();
      })
      .catch((err) => {
        console.error(err.response);
      });
  };
  useEffect(() => {
    getAllPayments();
    getAllEnrollments();
  }, []);

  useEffect(() => {
    console.log(selectedEnrl);
  }, [selectedEnrl]);

  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page]);

  return (
    <>
      <PageTitle>Payments</PageTitle>
      <>
        <div className="mb-4">
          <Button
            className="float-right"
            size="small"
            onClick={() => openModal()}
          >
            Create Payment
          </Button>
        </div>
        <TableContainer>
          <Table>
            <TableHeader>
              <tr className="text-gray-700 dark:text-gray-200">
                <TableCell>Course</TableCell>
                <TableCell>Paid On</TableCell>
                <TableCell>Amount</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {!data
                ? null
                : data.map((payment, i) => (
                    <TableRow
                      key={i}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      <TableCell>
                        <span className="text-sm">{`${payment.course_name} - ${
                          monthNames[payment.paid_for_month]
                        } ${payment.paid_for_year}`}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(payment.paid_date).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{`Rs. ${payment.amount}`}</span>
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
      </>

      {/* Add Payment */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Create Payment</ModalHeader>
        <ModalBody>
          <div className=" px-4 py-3 mb-8 bg-gray-200 rounded-lg shadow-md dark:bg-gray-800 ">
            <Label className="text-align: left max-w-md">
              <span className="mb-5">Select Course</span>
              <Select
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                onChange={(e) => {
                  setLastPaidDate(e.target.value);
                }}
              >
                <option key={"-1"}>Please select a course</option>
                {enrollments.map((enrollment, i) => (
                  <option
                    key={enrollment.enrollment_id}
                    value={enrollment.course_id}
                  >
                    {enrollment.course_name}
                  </option>
                ))}
              </Select>
            </Label>

            {latestPayment ? (
              <>
                <Label className="mt-2">
                  Last Paid For: {latestPayment.paid_for_month}/
                  {latestPayment.paid_for_year} on{" "}
                  {new Date(latestPayment.paid_date).toLocaleDateString()}
                </Label>
              </>
            ) : null}
          </div>
          {selectedEnrl ? (
            <div className="mt-4">
              <StripeContainer
                amount={selectedEnrl.amount}
                createPayment={createPayment}
                closeModal={closeModal}
                latestPayment={latestPayment}
              />
            </div>
          ) : null}
        </ModalBody>
        <ModalFooter>
          {/* <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              className="text-white"
              disabled={latestPayment == undefined}
              onClick={() => {
                createPayment();
              }}
            >
              <span>Pay for next month</span>
            </Button>
          </div> */}
          {/* <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div> */}
        </ModalFooter>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default Payments;
