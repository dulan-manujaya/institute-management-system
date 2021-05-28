import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import variables from "../common/globalVariables";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import { Select, Input } from "@windmill/react-ui";

import logo from "../assets/img/logo.png";

const CreateAccount = () => {
  const history = useHistory();
  const [gradeId, setGradeId] = useState("-1");
  const [grades, setGrades] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianMobile, setGuardianMobile] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentConfirmPassword, setStudentConfirmPassword] = useState("");
  const [studentMobile, setStudentMobile] = useState("");
  const [studentDob, setStudentDob] = useState("");
  const [studentGender, setStudentGender] = useState("Male");
  const [avatar, setAvatar] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("male-avatar.png");
  const today = new Date(Date.now());

  const currentDate = `${today.getFullYear()}${
    today.getMonth() + 1
  }${today.getDate()}`;

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

  const setDefaultAvatar = () => {
    if (studentGender === "Male") {
      setAvatarUrl("male-avatar.png");
    } else if (studentGender === "Female") {
      setAvatarUrl("female-avatar.png");
    }
  };

  const getGrades = async () => {
    try {
      const grades = await axios.get(`${variables.apiServer}/api/v1/grades`);
      setGrades(grades.data);
    } catch (err) {
      console.log(err);
    }
  };

  const gradeSelect = (e) => {
    // const selectedIndex = e.target.options.selectedIndex;
    // setGradeId(e.target.options[selectedIndex].getAttribute("data-index"));
    setGradeId(e.target.value);
  };

  const genderSelect = (e) => {
    // const selectedIndex = e.target.options.selectedIndex;
    // setGradeId(e.target.options[selectedIndex].getAttribute("data-index"));
    setGradeId(e.target.value);
  };

  const handleUpload = (event) => {
    var file = event.target.files[0];
    setAvatarUrl(currentDate + "-" + file.name);
    setAvatar(file);
  };

  const clearForm = () => {
    setStudentFirstName("");
    setStudentLastName("");
    setStudentEmail("");
    setGradeId("-1");
    setAvatarUrl("");
    setAvatar();
    setStudentPassword("");
    setStudentConfirmPassword("");
    setStudentMobile("");
    setStudentDob("");
    setStudentGender("Male");
    setSubmitted(false);
  };

  const formValidations = () => {
    var isValid = true;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (studentFirstName == "" || studentFirstName == null) {
      alert("Please enter your first name", "error");
      isValid = false;
      return isValid;
    } else if (studentLastName == "" || studentLastName == null) {
      alert("Please enter your last name", "error");
      isValid = false;
      return isValid;
    } else if (studentEmail == "" || studentEmail == null) {
      alert("Please enter your email", "error");
      isValid = false;
      return isValid;
    } else if (!emailRegex.test(String(studentEmail).toLowerCase())) {
      alert("Please enter a valid email", "error");
      isValid = false;
      return isValid;
    } else if (avatar == null || avatar == undefined) {
      alert("Please upload a picture for your avatar", "error");
      isValid = false;
      return isValid;
    } else if (studentPassword == "" || studentPassword == null) {
      alert("Please enter a password", "error");
      isValid = false;
      return isValid;
    } else if (studentPassword.length < 6) {
      alert("The password entered is less than 6 characters", "error");
      isValid = false;
      return isValid;
    } else if (studentPassword != studentConfirmPassword) {
      alert("The two password fields don't have matching passwords", "error");
      isValid = false;
      return isValid;
    } else if (studentMobile == "" || studentMobile == null) {
      alert("Please enter your mobile number", "error");
      isValid = false;
      return isValid;
    } else if (studentDob == "" || studentDob == null) {
      alert("Please enter/select your date of birth", "error");
      isValid = false;
      return isValid;
    } else if (studentGender == "" || studentGender == null) {
      alert("Please select a Gender", "error");
      isValid = false;
      return isValid;
    }
    return isValid;
  };

  useEffect(() => {
    setDefaultAvatar();
    getGrades();
  }, [studentGender]);

  return (
    <>
      <div className="min-h-screen p-6 dark:bg-gray-900">
        {/* <div className="flex justify-center mb-4">
          <img className="object-center" width="200px" src={logo}></img>
        </div> */}
        <div className="flex-1 h-full max-w-6xl mx-auto overflow-hidden bg-white rounded-lg dark:bg-gray-800">
          <div className="ml-4 mr-4">
            <PageTitle>Create Student Account</PageTitle>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const isValid = formValidations();
                if (isValid == true) {
                  console.log(studentAdmissionBody);
                  await axios
                    .post(
                      `${variables.apiServer}/api/v1/students/`,
                      studentAdmissionBody
                    )
                    .then((response) => {
                      console.log(response);
                      alert(response.data.message, "success");
                      history.push("/login");
                    })
                    .catch((error) => {
                      console.log(error.response.data);
                      alert(error.response.data.message, "error");
                    });
                }
              }}
            >
              <div className="bg-gray-800 rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
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
                    {!submitted ? null : !studentFirstName ? (
                      <p className="text-red-400 text-xs italic">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
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
                    {!submitted ? null : !studentLastName ? (
                      <p className="text-red-400 text-xs italic">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
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
                    {!submitted ? null : !studentEmail ? (
                      <p className="text-red-400 text-xs italic">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                  {/* <div className="md:w-full px-3">
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
                      <option selected value="-1">
                        Select Grade
                      </option>
                      {grades
                        .sort((a, b) => a.grade_id - b.grade_id)
                        .map((grade) => (
                          <option value={grade.grade_id} key={grade.grade_id}>
                            {grade.grade_name}
                          </option>
                        ))}
                    </Select>
                    {!submitted ? null : !gradeId ? (
                      <p className="text-red-400 text-xs italic">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div> */}
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                      htmlFor="grid-avatar"
                    >
                      Avatar
                    </label>
                    <Input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
                      id="grid-avatar"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleUpload}
                    />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-2">
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
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
                    {!submitted ? null : !studentPassword ? (
                      <p className="text-red-400 text-xs italic">
                        Please fill out this field.
                      </p>
                    ) : null}
                    <p className="text-gray-500 text-xs italic">
                      Make it as long and as crazy as you'd like
                    </p>
                  </div>
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Confirm Password
                    </label>
                    <Input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      id="grid-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="*********"
                      value={studentConfirmPassword}
                      onChange={(e) => {
                        setStudentConfirmPassword(e.target.value);
                      }}
                    />
                    {!submitted ? null : !studentConfirmPassword ? (
                      <p className="text-red-400 text-xs italic">
                        Please fill out this field.
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
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Mobile
                    </label>
                    <Input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      id="grid-city"
                      type="text"
                      placeholder="07xxxxxxxx"
                      value={studentMobile}
                      onChange={(e) => {
                        setStudentMobile(e.target.value);
                      }}
                    />
                    {!submitted ? null : !studentMobile ? (
                      <p className="text-red-400 text-xs italic">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                      htmlFor="grid-dob"
                    >
                      Date of Birth
                    </label>
                    <Input
                      className="appearance-none block w-full text-gray-400 border border-gray-400 rounded py-3 px-4"
                      id="grid-dob"
                      type="date"
                      value={studentDob}
                      onChange={(e) => {
                        setStudentDob(e.target.value);
                      }}
                    />
                    {!submitted ? null : !studentDob ? (
                      <p className="text-red-400 text-xs italic">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                      htmlFor="grid-gender"
                    >
                      Gender
                    </label>
                    <Select
                      className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
                      id="grid-gender"
                      onChange={(e) => {
                        setStudentGender(e.target.value);
                      }}
                    >
                      {" "}
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Select>
                    {!submitted ? null : !studentGender ? (
                      <p className="text-red-400 text-xs italic">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Guardian Email
                    </label>
                    <Input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
                      id="grid-email"
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
                    <label
                      className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Guardian Mobile
                    </label>
                    <Input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      id="grid-city"
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
                    Create Student
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateAccount;
