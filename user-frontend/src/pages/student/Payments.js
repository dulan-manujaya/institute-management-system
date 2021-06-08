import { Player } from "@lottiefiles/react-lottie-player";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import variables from "../../common/globalVariables";
import PageTitle from "../../components/Typography/PageTitle";
import SectionTitle from "../../components/Typography/SectionTitle";
// import { TeacherContext } from "../context/Context.Index";
import { EditIcon, TrashIcon, UploadIcon } from "../../icons";
import ToastMessage from "../../messages/HandleMessages";

const Payments = () => {
  const [studentId, setStudentId] = useState("0");
  const [courses, setCourses] = useState([]);
  const [assignmentCourse, setAssignmentCourse] = useState();
  const [deadline, setDeadline] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [response, setResponse] = useState("");
  const resultsPerPage = 9;
  const totalResults = response.length;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const monthNames = [
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

  const assignmentBody = {
    title: title,
    course_id: assignmentCourse,
    paper_url: fileName,
    deadline: endDate,
  };

  function onPageChange(p) {
    setPage(p);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const clearForm = () => {
    setFileName("");
    setFile("");
    setTitle("");
    // setDeadline(today.setDate(today.getDate() + 14));
  };
  function handleUpload(event) {
    var file = event.target.files[0];
    setFileName(
      `${variables.apiServer}/public/teacher-assignments/${file.name}`
    );
    setFile(file);
  }

  const handleFileSubmission = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${variables.apiServer}/api/v1/uploads/teacher-assignments`,
        formData
      );
      if (response) {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadAssignment = async () => {
    try {
      const token = sessionStorage.getItem("studentAccessToken");
      const response = await axios.post(
        `${variables.apiServer}/api/v1/assignments`,
        assignmentBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      handleFileSubmission(file);
      ToastMessage(response.data);
      clearForm();
      closeModal();
      // getAllSubmitted();
    } catch (err) {
      console.log(err.response.data);
      if (err.response.data.message === "Validation failed") {
        ToastMessage(err.response.data.errors[0].msg);
      } else if (err.response.data.message === "Internal server error") {
        ToastMessage("Please select correct deadline.");
      }
    }
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
      setData(
        payments.data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      setResponse(payments.data);
      // setTotalResults(submissions.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllCourses = async () => {
    const courses = await axios.get(
      `${variables.apiServer}/api/v1/courses/`,
      {}
    );
    setCourses(courses.data);
  };

  useEffect(() => {
    getAllPayments();
    getAllCourses();
  }, []);

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

      {/* Add Assignment */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Create Payment</ModalHeader>
        <ModalBody>
          <div className=" px-4 py-3 mb-8 bg-gray-200 rounded-lg shadow-md dark:bg-gray-800 ">
            <Label className="text-align: left max-w-md">
              <span>Select Course</span>
              <Select className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4">
                <option key={"-1"}>Please select a course</option>
                {courses.map((course, i) => (
                  <option key={course.course_id}>{course.course_name}</option>
                ))}
              </Select>
            </Label>

            <Label className="mt-4 text-align: left max-w-md">
              <span>Upload File</span>
            </Label>
            <div className="flex items-start">
              <div className="mb-2">
                {" "}
                <div className="relative h-40 rounded-lg border-dashed border-2 border-gray-700 dark:border-gray-200 bg-gray-200 dark:bg-gray-700 flex justify-center items-center hover:cursor-pointer">
                  <div className="absolute">
                    <div className="flex flex-col items-center ">
                      {" "}
                      <i className="fa fa-cloud-upload fa-3x text-gray-200" />{" "}
                      <span className="block text-gray-700 dark:text-gray-400 font-normal">
                        Attach you files here
                      </span>{" "}
                      <span className="block text-gray-700 font-normal">
                        or
                      </span>{" "}
                      <span className="block text-blue-700 font-normal">
                        Browse files
                      </span>{" "}
                    </div>
                  </div>{" "}
                  <input
                    onChange={handleUpload}
                    type="file"
                    className="h-full w-full opacity-0"
                  />
                </div>
              </div>
              <div className="items-left text-gray-700 dark:text-gray-400 mt-6 ml-8">
                {" "}
                <span>Accepted file type:.doc only</span>{" "}
                <p>Filename: {file.name}</p>
                <p>File type: {file.type}</p>
                <p>File size: {file.size} bytes</p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              iconLeft={UploadIcon}
              className="text-white"
              onClick={() => {
                if (title !== "" || title !== "") {
                }
                uploadAssignment();
              }}
            >
              <span>Upload</span>
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default Payments;
