import { Input, Select } from "@windmill/react-ui";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import variables from "../common/globalVariables";
import FormFillError from "../components/Error/FormFillError";
import PageTitle from "../components/Typography/PageTitle";
import { TeacherContext } from "../context/Context.Index";
import ToastMessage from "../messages/HandleMessages";

const StudentAdmission = () => {
  const { loggedInUser } = useContext(TeacherContext);
  const [submitted, setSubmitted] = useState(false);
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentConfirmPassword, setStudentConfirmPassword] = useState("");
  const [studentMobile, setStudentMobile] = useState("");
  const [studentDob, setStudentDob] = useState("");
  const [studentGender, setStudentGender] = useState("Male");
  const [avatar, setAvatar] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [confirmPassEqual, setConfirmPassEqual] = useState(true);
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianMobile, setGuardianMobile] = useState("");

  const studentAdmissionBody = {
    email: studentEmail,
    password: studentPassword,
    confirm_password: studentConfirmPassword,
    first_name: studentFirstName,
    last_name: studentLastName,
    avatar: avatarUrl,
    mobile: studentMobile,
    gender: studentGender,
    date_of_birth: studentDob,
    guardian_mobile: guardianMobile,
    guardian_email: guardianEmail,
  };

  const clearForm = () => {
    setStudentFirstName("");
    setStudentLastName("");
    setStudentEmail("");
    setAvatarUrl("");
    setAvatar();
    setStudentPassword("");
    setStudentConfirmPassword("");
    setStudentMobile("");
    setStudentDob("");
    setStudentGender("Male");
    setSubmitted(false);
  };

  const handleUpload = (event) => {
    var file = event.target.files[0];
    setAvatarUrl(`${variables.apiServer}/public/student-avatar/${file.name}`);
    setAvatar(file);
    // if (event.target.files[0]) {
    //   setImg({
    //     src: URL.createObjectURL(event.target.files[0]),
    //     alt: event.target.files[0].name,
    //   });
    // }
  };

  const handleFileSubmission = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${variables.apiServer}/api/v1/uploads/student-avatar`,
        formData
      );
      if (response) {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const matchPasswords = async () => {
      if (studentPassword === studentConfirmPassword) {
        setConfirmPassEqual(true);
      } else {
        setConfirmPassEqual(false);
      }
    };
    matchPasswords();
  }, [studentPassword, studentConfirmPassword]);

  useEffect(() => {
    const setDefaultAvatar = () => {
      if (studentGender === "Male" && avatarUrl === "") {
        setAvatarUrl("male-avatar.png");
      } else if (studentGender === "Female" && avatarUrl === "") {
        setAvatarUrl("female-avatar.png");
      }
    };
    setDefaultAvatar();
  }, [studentGender, loggedInUser]);

  return (
    <>
      <PageTitle>Student Admission</PageTitle>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log(studentAdmissionBody);
          console.log("Form Submitted!");
          const token = sessionStorage.getItem("adminAccessToken");
          try {
            await axios
              .post(
                `${variables.apiServer}/api/v1/students/`,
                studentAdmissionBody,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                console.log(response);
                handleFileSubmission(avatar);
                ToastMessage(response.data);
                clearForm();
              })
              .catch((error) => {
                console.log(error.response);
                if (error.response.data.message !== "Validation failed") {
                  ToastMessage(error.response.data.message);
                }
              });
          } catch (error) {
            console.log(error);
          }
        }}
      >
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
                value={studentFirstName}
                onChange={(e) => {
                  setStudentFirstName(e.target.value);
                }}
              />
              {!submitted ? null : !studentFirstName ? <FormFillError /> : null}
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
                value={studentLastName}
                onChange={(e) => {
                  setStudentLastName(e.target.value);
                }}
              />
              {!submitted ? null : !studentLastName ? <FormFillError /> : null}
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
                value={studentEmail}
                onChange={(e) => {
                  setStudentEmail(e.target.value);
                }}
              />
              {!submitted ? null : !studentEmail ? <FormFillError /> : null}
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
                value={studentPassword}
                onChange={(e) => {
                  setStudentPassword(e.target.value);
                }}
              />
              {!submitted ? null : !studentPassword ? <FormFillError /> : null}
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
                value={studentConfirmPassword}
                onChange={(e) => {
                  setStudentConfirmPassword(e.target.value);
                }}
              />
              {!submitted ? null : !studentConfirmPassword ? (
                <FormFillError />
              ) : null}
              {!confirmPassEqual ? (
                <p className="text-red-400 text-xs italic">
                  Password and Confirm Password must match.
                </p>
              ) : null}
              <p className="text-gray-500 text-xs italic">
                Make it as long and as crazy as you'd like
              </p>
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
                value={studentMobile}
                onChange={(e) => {
                  setStudentMobile(e.target.value);
                }}
              />
              {!submitted ? null : !studentMobile ? <FormFillError /> : null}
            </div>
            <div className="md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-dob"
              >
                Date of Birth
              </label>
              <Input
                className="appearance-none block w-full text-gray-900 border border-gray-400 rounded py-3 px-4"
                id="grid-dob"
                type="date"
                value={studentDob}
                onChange={(e) => {
                  setStudentDob(e.target.value);
                }}
              />
              {!submitted ? null : !studentDob ? <FormFillError /> : null}
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
                onChange={async (e) => {
                  setStudentGender(e.target.value);
                }}
              >
                {" "}
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
              {!submitted ? null : !studentGender ? <FormFillError /> : null}
            </div>
          </div>
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2">
                Guardian Email
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
                type="email"
                autoComplete="nope"
                placeholder="example@example.com"
                value={guardianEmail}
                onChange={(e) => {
                  setGuardianEmail(e.target.value);
                }}
              />
              {!submitted ? null : !studentEmail ? (
                <p className="text-red-400 text-xs italic">
                  Please fill out this field.
                </p>
              ) : null}
            </div>
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2">
                Guardian Mobile
              </label>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                type="text"
                placeholder="07xxxxxxxx"
                value={guardianMobile}
                onChange={(e) => {
                  setGuardianMobile(e.target.value);
                }}
              />
              {!submitted ? null : !studentMobile ? (
                <p className="text-red-400 text-xs italic">
                  Please fill out this field.
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              className="mr-5 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-md"
              type="button"
              onClick={() => clearForm()}
            >
              Clear Form
            </button>
            <button
              type="submit"
              onClick={() => setSubmitted(true)}
              className="mr-5 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg"
            >
              Submit Student
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default StudentAdmission;
