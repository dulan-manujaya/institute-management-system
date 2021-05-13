import React, { useState } from "react";
import { Input, Select } from "@windmill/react-ui";
import variables from "../common/globalVariables";

import PageTitle from "../components/Typography/PageTitle";

function AddTeacher() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [{ alt, src }, setImg] = useState({
    alt: "Upload an Image",
  });

  const handleUpload = (event) => {
    var file = event.target.files[0];
    setAvatarUrl(`${variables.apiServer}/public/student-avatar/${file.name}`);
    setAvatar(file);
    if (event.target.files[0]) {
      setImg({
        src: URL.createObjectURL(event.target.files[0]),
        alt: event.target.files[0].name,
      });
    }
  };
  return (
    <>
      <PageTitle>Add Teacher</PageTitle>
      <form>
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
            <div className="md:w-full px-3">
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
            </div>
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
          <div className="-mx-3 md:flex mb-2">
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
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
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              className="mr-5 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-md"
              type="button"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="mr-5 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg"
            >
              Submit Teacher
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddTeacher;
