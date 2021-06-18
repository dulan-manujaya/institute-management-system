import React, { useState, useEffect } from "react";
import axios from "axios";
import { Player } from "@lottiefiles/react-lottie-player";
import variables from "../common/globalVariables";
import { withRouter, useHistory, Link } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import { ForbiddenIcon } from "../icons";
import { Button } from "@windmill/react-ui";
import { ChatIcon } from "../icons";

import createStudentLottie from "../assets/lottie/student-not-found.json";

const StudentDetails = (props) => {
  const history = useHistory();

  const [studentId, setStudentId] = useState(props.match.params.studentid);
  const [student, setStudent] = useState("");
  const [showInformation, setShowInformation] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const getStudentDetails = async (id) => {
    try {
      const currStudent = await axios.get(
        `${variables.apiServer}/api/v1/students/id/${id}`
      );
      setStudent(currStudent.data);
    } catch (err) {
      console.log(err);
    }
  };

  // const getStudentCourses = async (student_id) => {
  //   try {
  //     const stuCourses = await axios.get(
  //       `${variables.apiServer}/api/v1/enrollments/student/${student_id}`
  //     );
  //     setEnrolledCourses(stuCourses.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const onShowInformation = () => {
    if (showInformation) {
      setShowInformation(false);
    } else {
      setShowInformation(true);
    }
  };

  useEffect(() => {
    getStudentDetails(studentId);
    // getStudentCourses(studentId);
    console.log(student);
  }, [showInformation]);

  if (!student) {
    return (
      <>
        <div className="flex flex-col items-center">
          <ForbiddenIcon
            className="w-12 h-12 mt-8 text-purple-200"
            aria-hidden="true"
          />
          <h1 className="text-6xl font-semibold text-gray-700 dark:text-gray-200">
            No Student Found
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Student not found. Check the Student ID and{" "}
            <Link
              className="text-purple-600 hover:underline dark:text-purple-300"
              to="/app/students"
            >
              go back
            </Link>
            .
          </p>
          <Player
            autoplay
            loop
            src={createStudentLottie}
            style={{ height: "300px", width: "300px" }}
          ></Player>
        </div>
      </>
    );
  }
  return (
    <>
      <PageTitle>Student Details</PageTitle>
      <div className="dark:bg-gray-900 dark:bg-gray-200">
        <div className="container mx-auto my-5 p-5">
          <div className="md:flex no-wrap md:-mx-2 ">
            {/* Left Side */}
            <div className="w-full md:w-3/12 md:mx-2">
              {/* Profile Card */}
              <div className="dark:bg-gray-800 bg-gray-300 p-3 border-t-4 border-green-400">
                <div className="image overflow-hidden">
                  <img
                    className="h-auto mx-auto mb-4"
                    src={student.avatar}
                    alt=""
                    width="300px"
                  />
                </div>
                <h2 className="dark:text-gray-200 text-gray-700 text-2xl text-semibold leading-6">
                  {student.first_name} {student.last_name}
                </h2>
                <ul className="dark:bg-gray-800 bg-gray-200 dark:text-gray-200 text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                  <li className="flex items-center py-3">
                    <span>Member since</span>
                    <span className="ml-auto">
                      {" "}
                      {new Date(student.registered_date).toLocaleDateString()}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            {/* End of profile card */}
            {/* Right Side */}
            <div className="w-full md:w-9/12 mx-2 h-64">
              {/* Profile tab */}
              {/* About Section */}
              <div className="dark:bg-gray-800 bg-gray-300 p-3 shadow-sm rounded-sm">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2 font-semibold dark:text-gray-200 text-gray-600 leading-8">
                    <span clas="text-green-500">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide text-gray-600 dark:text-gray-200">
                      About
                    </span>
                  </div>
                  <button>
                    <ChatIcon
                      className="w-8 h-8 text-green-500"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="dark:text-gray-400 text-gray-700">
                  <div className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        First Name :
                      </div>
                      <div className="px-4 py-2">{student.first_name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Last Name :</div>
                      <div className="px-4 py-2">{student.last_name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Gender :</div>
                      <div className="px-4 py-2">{student.gender}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Contact No :
                      </div>
                      <div className="px-4 py-2">{student.mobile}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Current Address :
                      </div>
                      <div className="px-4 py-2">
                        Beech Creek, PA, Pennsylvania
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Permanant Address :
                      </div>
                      <div className="px-4 py-2">
                        Arlington Heights, IL, Illinois
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Email :</div>
                      <div className="px-4 py-2">
                        <a
                          className="dark:text-white text-black"
                          href={`mailto:${student.email}`}
                        >
                          {student.email}
                        </a>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Birthday :</div>
                      <div className="px-4 py-2">
                        {" "}
                        {new Date(student.date_of_birth).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  className="block w-full text-white text-sm font-semibold rounded-lg focus:outline-none focus:shadow-outline hover:shadow-xs p-3 my-4"
                  onClick={() => {
                    onShowInformation();
                  }}
                >
                  Show Full Information
                </Button>
                {showInformation ? (
                  <div className="dark:bg-gray-800 bg-gray-300 p-3 shadow-sm rounded-sm">
                    {/* Guardian details */}
                  </div>
                ) : null}
              </div>
              {/* End of about section */}

              {/* Experience and education */}
              {/* <div className="dark:bg-gray-700 bg-gray-200 p-3 shadow-sm rounded-sm">
                <div className="grid grid-cols-2">
                  <div>
                    <div className="flex items-center space-x-2 font-semibold text-gray-500 leading-8 mb-3">
                      <span clas="text-green-500">
                        <svg
                          className="h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path
                            fill="#fff"
                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                          />
                        </svg>
                      </span>
                      <span className="tracking-wide dark:text-white text-black">
                        Enrolled Courses
                      </span>
                    </div>
                    <ul className="list-inside space-y-2">
                      {!enrolledCourses
                        ? null
                        : enrolledCourses.map((enrollments) => (
                            <li key={enrollments.enrollment_id}>
                              <div className="dark:text-gray-200 text-gray-700">
                                {enrollments.course_name}
                              </div>
                              <div className="dark:text-gray-400 text-gray-700 text-xs">
                                Registered:{" "}
                                {new Date(
                                  enrollments.enrolled_date
                                ).toLocaleDateString()}
                              </div>
                            </li>
                          ))}
                    </ul>
                  </div>
                </div>
      
              </div> */}
              {/* End of profile tab */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(StudentDetails);
