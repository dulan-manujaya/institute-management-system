import React, { useState } from "react";
import { Input } from "@windmill/react-ui";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ToastMessage from "../messages/HandleMessages";
import { ToastContainer } from "react-toastify";

import variables from "../common/globalVariables";

import PageTitle from "../components/Typography/PageTitle";

const AddTeacher = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const teacherObj = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    mobile: mobile,
    password: password,
    confirm_password: confirmPassword,
  };

  const createTeacher = async () => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .post(`${variables.apiServer}/api/v1/teachers`, teacherObj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        ToastMessage(response.data);
        history.push("/app/teachers");
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <>
      <PageTitle>Add Teacher</PageTitle>
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
                placeholder="Jane"
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
                placeholder="Doe"
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
                placeholder="example@example.com"
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
                placeholder="07xxxxxxxx"
                pattern="[0-9]{10}"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="-mx-3 md:flex mb-2">
            <div className="md:w-1/3 px-3">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Password
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                id="grid-password"
                type="password"
                autoComplete="new-password"
                placeholder="*********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <p className="text-gray-500 text-xs italic">
                Make it as long and as crazy as you'd like
              </p>
            </div>
            <div className="md:w-1/3 px-3">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-cpassword"
              >
                Confirm Password
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                id="grid-cpassword"
                type="password"
                autoComplete="new-password"
                placeholder="*********"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
          </div>
          {/* <div className="-mx-3 md:flex mb-2">
            
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
                onChange={(e) => {
                  setGender(e.target.value);
                }}
                value={gender}
              >
                {" "}
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </div>
          </div> */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              className="mr-5 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-md"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                createTeacher();
              }}
              className="mr-5 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg"
            >
              Submit Teacher
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddTeacher;
