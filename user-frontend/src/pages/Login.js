import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import ImageLight from "../assets/img/login-office.jpeg";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import { TwitterIcon } from "../icons";
import {
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Dropdown,
  DropdownItem,
  Badge,
} from "@windmill/react-ui";

const Login = () => {
  const history = useHistory();
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const changeUserType = (value) => {
    setUserType(value);
    localStorage.setItem("type", value);
  };
  const loginBody = {
    email: email,
    password: password,
  };
  // function radioClick(e) {
  //   setUserType(e.target.value);
  //   console.log(e.target.value);
  // }

  const getStudentId = async () => {
    try {
      const token = sessionStorage.getItem("studentAccessToken");
      const currStudent = await axios.get(
        "http://localhost:4000/api/v1/students/whoami",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sid = currStudent.data.student_id;
      setStudentId(sid);
      console.log(studentId);
      history.push("/app/dashboard");
    } catch (err) {
      console.log(err);
      history.push("/login");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  function openModal() {
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
    // setUserType(userType);
  }

  const loginFunction = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/students/login",
        loginBody
      );
      console.log(response.data.token);
      sessionStorage.setItem("studentAccessToken", response.data.token);
      history.push("/app/dashboard");
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  useEffect(() => {
    getStudentId();
  }, []);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Invalid Selection</ModalHeader>
        <ModalBody>
          You haven't selected any account type yet. Please select an account
          type to continue.
        </ModalBody>
      </Modal>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src={ImageLight}
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block"
                src={ImageDark}
                alt="Office"
              />
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <div className="flex justify-center p-6">
                  <Label className="inline-flex items-center mt-3" radio>
                    <Input
                      id="student"
                      type="radio"
                      className="form-radio h-5 w-5 text-gray-600"
                      name="userType"
                      value="student"
                      defaultChecked
                      onClick={(e) => changeUserType(e.target.value)}
                    />
                    <span className="ml-2 mr-2">Student</span>
                  </Label>
                  <Label className="inline-flex items-center mt-3" radio>
                    <Input
                      id="teacher"
                      type="radio"
                      className="form-radio h-5 w-5 text-gray-600"
                      name="userType"
                      value="teacher"
                      onClick={(e) => changeUserType(e.target.value)}
                    />
                    <span className="ml-2 mr-2">Teacher</span>
                  </Label>
                  <Label className="inline-flex items-center mt-3" radio>
                    <Input
                      id="parent"
                      type="radio"
                      className="form-radio h-5 w-5 text-gray-600"
                      name="userType"
                      value="parent"
                      onClick={(e) => changeUserType(e.target.value)}
                    />
                    <span className="ml-2">Parent</span>
                  </Label>
                </div>

                <Label>
                  <span>Email</span>
                  <Input
                    className="mt-1"
                    type="email"
                    placeholder="john@doe.com"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Label>

                <Label className="mt-4">
                  <span>Password</span>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="***************"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </Label>

                <Button onClick={() => loginFunction()} className="mt-4">
                  Log in
                </Button>

                <hr className="my-8" />

                <p className="mt-4">
                  <Link
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    to="/forgot-password"
                  >
                    Forgot your password?
                  </Link>
                </p>
                <p className="mt-1" hidden = {userType != "student" ? true : false }>
                  <Link
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    to="/create-account"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
