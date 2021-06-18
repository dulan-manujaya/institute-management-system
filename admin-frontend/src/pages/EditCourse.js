import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@windmill/react-ui";
import ToastMessage from "../messages/HandleMessages";
import { ToastContainer } from "react-toastify";

import PageTitle from "../components/Typography/PageTitle";
import variables from "../common/globalVariables";

const EditCourse = (props) => {
  const [courseId, setCourseId] = useState(props.match.params.courseid);
  const [courseData, setCourseData] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [amount, setAmount] = useState("");

  const courseDetails = {
    course_name: courseName,
    amount: amount,
    description: courseDescription,
  };

  const getCourseDetails = async () => {
    await axios
      .get(`${variables.apiServer}/api/v1/courses/id/${courseId}`)
      .then((response) => {
        console.log(response);
        setCourseData(response.data);
        setCourseDescription(response.data.description);
        setAmount(response.data.amount);
        setCourseName(response.data.course_name);
      });
  };

  const editCourseDetails = async () => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .patch(
        `${variables.apiServer}/api/v1/courses/id/${courseId}`,
        courseDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        ToastMessage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCourseDetails();
  }, []);

  return (
    <>
      <PageTitle>Edit Course</PageTitle>
      <div>
        <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 flex flex-col my-2 dark:bg-gray-800">
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-courset-name"
              >
                Course Name
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
                id="grid-courset-name"
                type="text"
                placeholder={courseData.course_name}
                value={courseName}
                onChange={(e) => {
                  setCourseName(e.target.value);
                }}
              />
            </div>
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-course-amount"
              >
                Course Amount
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                id="grid-last-name"
                type="text"
                placeholder={courseData.amount}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
              {/* {!submitted ? null : !studentLastName ? <FormFillError /> : null} */}
            </div>
          </div>
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-courset-name"
              >
                Course Description
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
                id="grid-courset-name"
                type="text"
                placeholder={courseData.description}
                value={courseDescription}
                onChange={(e) => {
                  setCourseDescription(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => {
                editCourseDetails();
              }}
              className="mr-5 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg"
            >
              Submit Details
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditCourse;
