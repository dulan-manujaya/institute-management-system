import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";

import ImageLight from "../assets/img/login-office.jpeg";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import { TwitterIcon } from "../icons";
import { Label, Input, Button } from "@windmill/react-ui";
import variables from "../common/globalVariables";
import { TeacherContext } from "../context/Context.Index";

const Login = () => {
  const history = useHistory();
  const { setLoggedInUser } = useContext(TeacherContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginBody = {
    email: email,
    password: password,
  };

  const getAdminId = async () => {
    try {
      const token = sessionStorage.getItem("adminAccessToken");
      if (token) {
        const currAdmin = await axios.get(
          `${variables.apiServer}/api/v1/admins/whoami`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (currAdmin) {
          console.log(currAdmin);
          const loggedUser = {
            email: currAdmin.data.email,
            first_name: currAdmin.data.first_name,
            last_name: currAdmin.data.last_name,
            mobile: currAdmin.data.mobile,
            admin_id: currAdmin.data.admin_id,
            token: sessionStorage.getItem("adminAccessToken"),
          };
          setLoggedInUser(loggedUser);
          history.push("/app/dashboard");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loginFunction = async () => {
    try {
      const response = await axios.post(
        `${variables.apiServer}/api/v1/admins/login`,
        loginBody
      );
      console.log(response.data);
      sessionStorage.setItem("adminAccessToken", response.data.token);
      setLoggedInUser(response.data);
      history.push("/app/dashboard");
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  useEffect(() => {
    getAdminId();
  }, []);

  return (
    <>
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
                {/* <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Login as:
                </h1>
                <div className="flex justify-center">
                  <div className="mt-2">
                    <label className="inline-flex items-center text-white">
                      <input
                        type="radio"
                        className="form-radio"
                        name="accountType"
                        defaultValue="teacher"
                        onClick={(e) => {
                          radioClick(e);
                        }}
                      />
                      <span className="ml-2">Teacher</span>
                    </label>
                    <label className="inline-flex items-center ml-6 text-white">
                      <input
                        type="radio"
                        className="form-radio"
                        name="accountType"
                        defaultValue="student"
                        onClick={(e) => {
                          radioClick(e);
                        }}
                      />
                      <span className="ml-2">Student</span>
                    </label>
                  </div>
                </div> */}

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
                <Button className="mt-4" block layout="outline">
                  <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                  Twitter
                </Button>

                <p className="mt-4">
                  <Link
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    to="/forgot-password"
                  >
                    Forgot your password?
                  </Link>
                </p>
                <p className="mt-1">
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
