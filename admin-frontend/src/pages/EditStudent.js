import React, { useState, useEffect } from "react";
import { Input, Select } from "@windmill/react-ui";
import axios from "axios";
import ToastMessage from "../messages/HandleMessages";
import { ToastContainer } from "react-toastify";

import variables from "../common/globalVariables";

import PageTitle from "../components/Typography/PageTitle";

const EditStudent = (props) => {
  const [studentId, setStudentId] = useState(props.match.params.studentid);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [studentData, setStudentData] = useState("");

  const studentObj = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    mobile: mobile,
    gender: gender,
  };

  const editStudent = async () => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .patch(
        `${variables.apiServer}/api/v1/students/id/${studentId}`,
        studentObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        ToastMessage(response.data.message);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const getStudentDetails = async () => {
    await axios
      .get(`${variables.apiServer}/api/v1/students/id/${studentId}`)
      .then((response) => {
        console.log(response);
        setStudentData(response.data);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmail(response.data.email);
        setMobile(response.data.mobile);
        setGender(response.data.gender);
      });
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  return (
    <>
      <PageTitle>Edit Student</PageTitle>
      <div>
        <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 flex flex-col my-2 dark:bg-gray-800">
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                First Name
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
                id="grid-first-name"
                type="text"
                placeholder={studentData.first_name}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              {/* {!submitted ? null : !studentFirstName ? <FormFillError /> : null} */}
            </div>
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Last Name
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                id="grid-last-name"
                type="text"
                placeholder={studentData.last_name}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
              {/* {!submitted ? null : !studentLastName ? <FormFillError /> : null} */}
            </div>
            {/* <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-avatar"
              >
                Avatar
              </label>
              <Input
                className="appearance-none block w-full bg-white text-grey-darker border border-red rounded py-3 px-4"
                id="grid-avatar"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  handleUpload(e);
                }}
              />
            </div> */}
          </div>
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-1/3 px-3">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-email"
              >
                Email
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
                id="grid-email"
                type="email"
                autoComplete="nope"
                placeholder={studentData.email}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Mobile
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                id="grid-city"
                type="tel"
                placeholder={studentData.mobile}
                pattern="[0-9]{10}"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-gender"
              >
                Gender
              </label>
              <Select
                className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
                id="grid-gender"
                value={studentData.gender}
                onChange={async (e) => {
                  setGender(e.target.value);
                }}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
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
                editStudent();
              }}
              className="mr-5 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg"
            >
              Submit Student
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditStudent;
