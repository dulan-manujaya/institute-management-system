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
import variables from "../common/globalVariables";
import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
// import { TeacherContext } from "../context/Context.Index";
import { EditIcon, TrashIcon, UploadIcon } from "../icons";
import ToastMessage from "../messages/HandleMessages";

const Courses = () => {
  // const { loggedInUser } = useContext(TeacherContext);
  const { loggedInUser } = useState();
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

  const getAllSubmitted = async () => {
    try {
      const submissions = await axios.get(
        `${variables.apiServer}/api/v1/assignments/myassignments/${loggedInUser.teacher_id}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setData(
        submissions.data.slice(
          (page - 1) * resultsPerPage,
          page * resultsPerPage
        )
      );
      setResponse(submissions.data);
      // setTotalResults(submissions.data.length);
    } catch (err) {
      console.log(err);
    }
  };

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
      console.log(assignmentBody);
      const response = await axios.post(
        `${variables.apiServer}/api/v1/assignments`,
        assignmentBody,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      console.log(response);
      handleFileSubmission(file);
      ToastMessage(response.data);
      clearForm();
      closeModal();
      getAllSubmitted();
    } catch (err) {
      console.log(err.response.data);
      if (err.response.data.message === "Validation failed") {
        ToastMessage(err.response.data.errors[0].msg);
      } else if (err.response.data.message === "Internal server error") {
        ToastMessage("Please select correct deadline.");
      }
    }
  };

  const getAllCourses = async () => {
    try {
      const course = await axios.get(
        `${variables.apiServer}/api/v1/courses/mycourses/${loggedInUser.teacher_id}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      console.log(course);
      setCourses(course.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    // getAllCourses();
    // getAllSubmitted();
    clearForm();
  }, [loggedInUser]);

  useEffect(() => {
    if (deadline) {
      console.log(deadline);
      // setEndDate(deadline.toISOString().slice(0, 19).replace("T", " "));
    }
  }, [deadline]);

  useEffect(() => {
    getAllSubmitted();
  }, [page]);

  return (
    <>
      <PageTitle>Courses</PageTitle>
      {/* <div className="mb-4">
        <Button size="larger" onClick={openModal}>
          Add New Assignment
        </Button>
      </div> */}
      {!data ? (
        <>
          <Player
            autoplay
            loop
            src="https://assets9.lottiefiles.com/packages/lf20_zxliqmhr.json"
            style={{ height: "300px", width: "300px" }}
          ></Player>
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-semibold text-gray-700 dark:text-gray-200">
              No Assignments!
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              You have not uploaded any assignments yet.{" "}
              <button
                onClick={openModal}
                className="text-purple-600 hover:underline dark:text-purple-300"
              >
                Upload your first assignment.
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          <TableContainer className="mb-4">
            <Table>
              <TableHeader>
                <tr className="text-gray-700 dark:text-gray-200">
                  <TableCell>Title</TableCell>
                  <TableCell>Enrolled Date</TableCell>
                  <TableCell>Actions</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                <TableRow key="1" className="text-gray-700 dark:text-gray-300">
                  <TableCell>
                    <span className="text-sm">Science</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">10-Jun-2021</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button size="small">Assignments</Button>
                      <Button size="small" onClick={openModal}>Exams</Button>
                      <Button size="small" onClick={openModal}>Payments</Button>
                      
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow key="1" className="text-gray-700 dark:text-gray-300">
                  <TableCell>
                    <span className="text-sm">Maths</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">10-Jun-2021</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button size="small">Assignments</Button>
                      <Button size="small" onClick={openModal}>Exams</Button>
                      <Button size="small" onClick={openModal}>Payments</Button>
                      
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow key="1" className="text-gray-700 dark:text-gray-300">
                  <TableCell>
                    <span className="text-sm">Computing</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">10-Jun-2021</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button size="small">Assignments</Button>
                      <Button size="small" onClick={openModal}>Exams</Button>
                      <Button size="small" onClick={openModal}>Payments</Button>
                      
                    </div>
                  </TableCell>
                </TableRow>

                
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
      )}

      {/* Add Assignment */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Submit Answer Sheet</ModalHeader>
        <ModalBody>
          <div className=" px-4 py-3 mb-8 bg-gray-200 rounded-lg shadow-md dark:bg-gray-800 ">
            <Label className="text-align: left max-w-md">
              <span>Answer Sheet Title</span>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                placeholder="Maths Geometry"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Label>
            {/* <Label className="mt-4 text-align: left max-w-md">
              <span>Select Deadline</span>
              <br></br>
              <DatePicker
                className="appearance-none block w-full dark:bg-gray-700 text-grey-darker border border-grey-lighter dark:text-white rounded py-3 px-4"
                selected={deadline}
                onChange={(date) => {
                  setDeadline(date);
                  setEndDate(date.toISOString().slice(0, 19).replace("T", " "));
                }}
              />
            </Label> */}

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

export default Courses;
