import { Player } from "@lottiefiles/react-lottie-player";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@windmill/react-ui";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import variables from "../../common/globalVariables";
import PageTitle from "../../components/Typography/PageTitle";
import SectionTitle from "../../components/Typography/SectionTitle";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Courses = () => {
  const [studentId, setStudentId] = useState("0");

  const [enrollmentsResponse, setEnrollmentResponse] = useState([]);
  const totalEnrollmentResults = enrollmentsResponse.length;
  const [enrollmentsPage, setEnrollmentsPage] = useState(1);
  const [enrollmentsData, setEnrollmentsData] = useState([]);

  const [coursesResponse, setCoursesResponse] = useState([]);
  const totalCoursesResults = coursesResponse.length;
  const [coursesPage, setCoursesPage] = useState(1);
  const [coursesData, setCoursesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const resultsPerPage = 10;

  function onEnrollmentsPageChange(p) {
    setEnrollmentsPage(p);
  }

  function onCoursesPageChange(p) {
    setCoursesPage(p);
  }

  const alert = (message, type) => {
    console.log(type);
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

  const getAllEnrollments = async () => {
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
      const courses = await axios.get(
        `${variables.apiServer}/api/v1/enrollments/student/${sid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnrollmentsData(
        courses.data.slice(
          (enrollmentsPage - 1) * resultsPerPage,
          enrollmentsPage * resultsPerPage
        )
      );
      setEnrollmentResponse(courses.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllCourses = async () => {
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
      const courses = await axios.get(
        `${variables.apiServer}/api/v1/courses/getByStudentId/${sid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCoursesData(
        courses.data.slice(
          (coursesPage - 1) * resultsPerPage,
          coursesPage * resultsPerPage
        )
      );
      setCoursesResponse(courses.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createEnrollment = async (course_id) => {
    const enrollmentBody = {
      student_id: studentId,
      course_id: course_id,
    };
    try {
      await axios
        .post(`${variables.apiServer}/api/v1/enrollments/`, enrollmentBody)
        .then((response) => {
          alert(response.data.message, "success");
        });
      getAllEnrollments();
      getAllCourses();
    } catch (err) {}
  };

  useEffect(() => {
    getAllEnrollments();
    getAllCourses();
  }, [enrollmentsPage]);

  useEffect(() => {
    setEnrollmentsData(
      enrollmentsResponse.slice(
        (enrollmentsPage - 1) * resultsPerPage,
        enrollmentsPage * resultsPerPage
      )
    );
  }, []);

  useEffect(() => {
    setCoursesData(
      coursesResponse.slice(
        (coursesPage - 1) * resultsPerPage,
        coursesPage * resultsPerPage
      )
    );
  }, [coursesPage]);
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Course : {selectedName}</ModalHeader>
        <ModalBody>
          Description: <span className="font-bold">{selectedDescription}</span>
          <br />
          <br />
          Teacher: <span className="font-bold">{selectedTeacher}</span>
          <br />
          <br />
          Amount: <span className="font-bold">LKR {selectedAmount}/=</span>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              className="text-white"
              onClick={() => {
                createEnrollment(selectedId);
                // deleteCourse(selectedId);
              }}
            >
              <span>Enroll</span>
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <PageTitle>Courses</PageTitle>
      <SectionTitle>Enrolled Courses</SectionTitle>
      <TableContainer className="mb-4">
        <Table>
          <TableHeader>
            <tr className="text-gray-700 dark:text-gray-200">
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Enrolled Date</TableCell>
              {/* <TableCell>Actions</TableCell> */}
            </tr>
          </TableHeader>
          <TableBody>
            {!enrollmentsData
              ? null
              : enrollmentsData.map((enrollment, i) => (
                  <TableRow
                    key={i}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <TableCell>
                      <span className="text-sm">{enrollment.course_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{enrollment.description}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(
                          enrollment.enrolled_date
                        ).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalEnrollmentResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onEnrollmentsPageChange}
          />
        </TableFooter>
      </TableContainer>
      <SectionTitle>Other Courses</SectionTitle>
      <TableContainer className="mb-4">
        <Table>
          <TableHeader>
            <tr className="text-gray-700 dark:text-gray-200">
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Tutor</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {!coursesData
              ? null
              : coursesData.map((course, i) => (
                  <TableRow
                    key={i}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <TableCell>
                      <span className="text-sm">{course.course_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{course.description}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{course.teacher_name}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button
                          size="small"
                          onClick={(e) => {
                            setSelectedId(course.course_id);
                            setSelectedName(course.course_name);
                            setSelectedDescription(course.description);
                            setSelectedAmount(course.amount);
                            setSelectedTeacher(course.teacher_name);
                            openModal();
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalCoursesResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onCoursesPageChange}
          />
        </TableFooter>
      </TableContainer>
      <ToastContainer />
    </>
  );
};

export default Courses;
