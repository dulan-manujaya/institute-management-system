import React, { useState, useEffect } from "react";
import { Input, Select } from "@windmill/react-ui";
import axios from "axios";
import ToastMessage from "../messages/HandleMessages";
import { ToastContainer } from "react-toastify";

import variables from "../common/globalVariables";

import PageTitle from "../components/Typography/PageTitle";

const CreateCourse = () => {
  const [teacherId, setTeacherId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [amount, setAmount] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  const courseObject = {
    teacher_id: teacherId,
    amount: amount,
    course_name: courseName,
    description: description,
  };

  const getTeachers = async () => {
    await axios
      .get(`${variables.apiServer}/api/v1/teachers`)
      .then((response) => {
        console.log(response);
        setTeachers(response.data);
      });
  };

  const createCourse = async () => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .post(`${variables.apiServer}/api/v1/courses`, courseObject, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        ToastMessage(response.data);
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response) {
          ToastMessage(error.response.data.message);
        }
      });
  };

  useEffect(() => {
    getTeachers();
  }, []);

  return (
    <>
      <PageTitle>Create Course</PageTitle>
      <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 flex flex-col my-2 dark:bg-gray-800">
        <div className="-mx-3 md:flex mb-6">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2">
              Course Name
            </label>
            <Input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
              type="text"
              placeholder="English"
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
              }}
            />
            {/* {!submitted ? null : !studentFirstName ? <FormFillError /> : null} */}
          </div>
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2">
              Course Amount
            </label>
            <Input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
              type="number"
              placeholder="1500"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
            {/* {!submitted ? null : !studentFirstName ? <FormFillError /> : null} */}
          </div>
        </div>
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
              htmlFor="grid-gender"
            >
              Conducting Teacher
            </label>
            <Select
              className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
              id="grid-gender"
              onChange={(e) => {
                setTeacherId(e.target.value);
              }}
              value={teacherId}
            >
              <option>Select Teacher</option>
              {teachers.map((teacher, i) => (
                <option key={i} value={teacher.teacher_id}>
                  {teacher.first_name + " " + teacher.last_name}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2">
              Course Description
            </label>
            <Input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
              type="text"
              placeholder="Description about the course"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            {/* {!submitted ? null : !studentFirstName ? <FormFillError /> : null} */}
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="mr-5 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-md"
            type="button"
          >
            Clear Form
          </button>
          <button
            onClick={() => {
              createCourse();
            }}
            className="mr-5 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg"
          >
            Create Course
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateCourse;
