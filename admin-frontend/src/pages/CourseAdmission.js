import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Player } from "@lottiefiles/react-lottie-player";
import variables from "../common/globalVariables";
import ToastMessage from "../messages/HandleMessages";
import { ToastContainer } from "react-toastify";
import { TeacherContext, GradeContext } from "../context/Context.Index";

import PageTitle from "../components/Typography/PageTitle";
import {
  Select,
  Input,
  Avatar,
  TableCell,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Pagination,
  Label,
  Button,
} from "@windmill/react-ui";

const CourseAdmission = () => {
  const { loggedInUser } = useContext(TeacherContext);
  const [studentId, setStudentId] = useState("");
  const [studentSearchId, setStudentSearchId] = useState("");
  const [student, setStudent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [gradeCompatibility, setGradeCompatibility] = useState(true);
  const [courses, setCourses] = useState([]);
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [enrollmentTable, setEnrollmentTable] = useState(1);
  const [enrollCount, setEnrollmentCount] = useState("");
  const [courseId, setCourseId] = useState("");
  const [gradeId, setGradeId] = useState("-1");
  const { grades } = useContext(GradeContext);
  const [theme, setTheme] = useState("");
  const today = new Date(Date.now());

  const resultsPerPage = 5;

  const enrollmentBody = {
    course_id: courseId,
    student_id: studentId,
    is_accepted: true,
  };

  const getStudentById = async (id) => {
    try {
      const response = await axios.get(
        `${variables.apiServer}/api/v1/students/id/${id}`
      );
      setStudent(response.data);
    } catch (err) {}
  };

  const onSearch = (id) => {
    getStudentById(id);
    getStudentEnrollments(id);
  };

  const onPageChangeEnrollmentTable = (p) => {
    setEnrollmentTable(p);
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

  const gradeSelect = (e) => {
    setGradeId(e.target.value);
    if (student) {
      if (String(e.target.value) !== String(student.grade_id)) {
        setGradeCompatibility(false);
      } else {
        setGradeCompatibility(true);
      }
    }

    getCourseByGrade(loggedInUser.teacher_id, e.target.value);
  };

  const getCourseByGrade = async (teacher_id, grade_id) => {
    try {
      const course = await axios.get(
        `${variables.apiServer}/api/v1/courses/mycourses/${loggedInUser.teacher_id}/grade/${grade_id}`,
        {
          headers: {
            Authorization: `Bearer ${variables.token}`,
          },
        }
      );
      setCourses(course.data);
    } catch (err) {
      console.log(err.message);
    }
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
            Authorization: `Bearer ${variables.token}`,
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

  const createEnrollment = async () => {
    clearForm();
    await axios
      .post(`${variables.apiServer}/api/v1/enrollments/`, enrollmentBody, {
        headers: {
          Authorization: `Bearer ${variables.token}`,
        },
      })
      .then((response) => {
        ToastMessage(response.data.message);
        onSearch(studentSearchId);
        initialPayment(response.data.newId);
      })
      .catch((error) => {
        console.log(error.response.data);
        ToastMessage(error.response.data.message);
      });
  };

  const clearForm = () => {
    setStudentId("");
    setStudent("");
    setSubmitted(false);
    setGradeCompatibility(true);
    setCourses([]);
    setStudentEnrollments([]);
    setEnrollmentTable(1);
    setEnrollmentCount("");
    setCourseId("");
    setGradeId(1);
  };

  useEffect(() => {
    setTheme(sessionStorage.getItem("theme"));
  }, [theme]);

  useEffect(() => {
    if (gradeId !== "-1") getCourseByGrade(loggedInUser.teacher_id, gradeId);
  }, [gradeId]);

  return (
    <>
      <PageTitle>Course Enrollments</PageTitle>
      <div className="card">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded px-8 pb-8 mb-4 flex flex-col my-2">
            <div className="mb-4 flex justify-between items-center mt-8">
              <div className="flex pr-4 mb-4">
                <div className="relative max-w-md">
                  <Input
                    type="number"
                    value={studentSearchId}
                    onChange={(e) => {
                      setStudentSearchId(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-gray-200 rounded-lg shadow focus:outline-none focus:shadow-outline placeholder-gray-600 dark:placeholder-gray-400 text-gray-800 font-medium"
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
                <Button
                  onClick={() => {
                    setStudentId(studentSearchId);
                    onSearch(studentSearchId);
                  }}
                >
                  Search
                </Button>
                {!student ? (
                  <Button disabled className="ml-4">
                    Clear Results
                  </Button>
                ) : (
                  <Button
                    className="ml-4"
                    onClick={() => {
                      setStudentId("");
                      setStudentSearchId("");
                      setStudent("");
                    }}
                  >
                    Clear Results
                  </Button>
                )}
              </div>
            </div>
            <div className="relative p-px overflow-hidden transition duration-300 transform border rounded shadow-sm group hover:shadow-xl">
              <div className="absolute bottom-0 left-0 w-full h-1 duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
              <div className="absolute bottom-0 left-0 w-1 h-full duration-300 origin-bottom transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100" />
              <div className="absolute top-0 left-0 w-full h-1 duration-300 origin-right transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
              <div className="absolute bottom-0 right-0 w-1 h-full duration-300 origin-top transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100" />
              <div className="relative p-5 bg-gray-200 dark:bg-gray-700 rounded-sm">
                {!student ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                      No Student Found
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Student not found. Check the Student ID and search again!
                    </p>
                    <Player
                      autoplay
                      loop
                      src="https://assets7.lottiefiles.com/packages/lf20_otwkmzu4.json"
                      style={{ height: "300px", width: "300px" }}
                    ></Player>
                  </>
                ) : (
                  <div>
                    <div className="flex justify-center text-center">
                      <Avatar
                        className="hidden mr-3 md:block"
                        src={student.avatar}
                        alt="User avatar"
                      />
                      <label className="text-gray-800 dark:text-white leading-5 font-semibold text-2xl">
                        {student.first_name} {student.last_name}
                      </label>
                    </div>
                    <div className="flex justify-center">
                      <div className="flex ml-4">
                        <Label className="text-gray-400 font-semibold">
                          Student ID:{" "}
                        </Label>
                        <h6 className="text-gray-600 dark:text-gray-300 leading-5 ml-4 text-sm font-semibold">
                          {student.student_auth_id}
                        </h6>
                      </div>
                      <div className="flex ml-4">
                        <Label className="text-gray-400 font-semibold">
                          Registered On:{" "}
                        </Label>
                        <h6 className="text-gray-600 dark:text-gray-300 leading-5 ml-4 text-sm font-semibold">
                          {new Date(
                            student.registered_date
                          ).toLocaleDateString()}
                        </h6>
                      </div>
                      <div className="flex text-gray-400 font-semibold">
                        <Label className="ml-4">Email: </Label>
                        <h6 className="text-gray-600 dark:text-gray-300 leading-5 ml-4 text-sm font-semibold">
                          {student.email}
                        </h6>
                      </div>
                      <div className="flex text-gray-400 font-semibold">
                        <Label className="ml-4">Date of Birth: </Label>
                        <h6 className="text-gray-600 dark:text-gray-300 leading-5 ml-4 text-sm font-semibold">
                          {new Date(student.date_of_birth).toLocaleDateString()}
                        </h6>
                      </div>
                    </div>
                    {!studentEnrollments ? null : (
                      <TableContainer>
                        <h3 className="block uppercase tracking-wide text-gray-600 dark:text-gray-300 text-xs font-bold mt-4 mb-2">
                          Currently Enrolled Courses
                        </h3>
                        <Table>
                          <TableHeader>
                            <tr className="text-gray-600 dark:text-gray-300">
                              <TableCell>Course</TableCell>
                              <TableCell>Registered Date</TableCell>
                            </tr>
                          </TableHeader>
                          <TableBody>
                            {!studentEnrollments
                              ? window.location.reload()
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
                  </div>
                )}
              </div>
            </div>
            <h3 className="block uppercase tracking-wide text-gray-600 dark:text-gray-400 text-xs font-bold mt-4 mb-2">
              New Enrollment
            </h3>

            <div className="-mx-3 md:flex mb-6 mt-4">
              <div className="md:w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                  htmlFor="grid-grade"
                >
                  Grade
                </label>
                <Select
                  className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
                  value={gradeId}
                  onChange={(e) => {
                    gradeSelect(e);
                  }}
                >
                  <option>Select Grade</option>
                  {!grades ? (
                    <>
                      <option>Grade 6</option>
                      <option>Grade 7</option>
                      <option>Grade 8</option>
                      <option>Grade 9</option>
                    </>
                  ) : (
                    grades
                      .sort((a, b) => a.grade_id - b.grade_id)
                      .map((grade) => (
                        <option value={grade.grade_id} key={grade.grade_id}>
                          {grade.grade_name}
                        </option>
                      ))
                  )}
                </Select>
                {!submitted ? null : !gradeId ? (
                  <p className="text-red-400 text-xs italic">
                    Please fill out this field.
                  </p>
                ) : null}
                {!gradeCompatibility ? (
                  <p className="text-yellow-400 text-xs mt-2">
                    ⚠ Selected garde is not similar to student's current grade.
                  </p>
                ) : !gradeId ? null : null}
              </div>
              <div className="md:w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                  htmlFor="grid-grade"
                >
                  Course
                </label>
                <Select
                  className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
                  onChange={(e) => {
                    setCourseId(e.target.value);
                  }}
                  value={courseId}
                >
                  <option>Select Course</option>

                  <option>Grade 6 English</option>
                  <option>Grade 6 Mathematcis</option>
                  <option>Grade 6 Sciencee</option>
                  <option>Grade 6 History</option>

                  {/* {courses.map((course) => (
                    <option value={course.course_id} key={course.course_id}>
                      {course.course_name}
                    </option>
                  ))} */}
                </Select>
                {!submitted ? null : !gradeId ? (
                  <p className="text-red-400 text-xs italic">
                    Please fill out this field.
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setSubmitted(true);
                  createEnrollment();
                }}
                className="mr-5 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg"
              >
                Enroll Student
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default CourseAdmission;
