import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import variables from "../common/globalVariables";

import ImageLight from "../assets/img/forgot-password-office.jpeg";
import ImageDark from "../assets/img/forgot-password-office-dark.jpeg";
import { Label, Input, Button } from "@windmill/react-ui";

import OTPInput from "../components/OTPInput";

const ForgotPassword = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailHidden, setEmailHidden] = useState(false);
  const [otpHidden, setOTPHidden] = useState(true);
  const [newPasswordHidden, setNewPasswordHidden] = useState(true);

  const confirmEmail = async () => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
      alert("Please enter a valid email", "error");
    } else {
      let type = localStorage.getItem("type");
      await axios
        .post(`${variables.apiServer}/api/v1/forgot-password/verifyEmail/`, {
          type: type,
          email: email,
        })
        .then((response) => {
          if (response.data.isExist == true) {
            setEmailHidden(true);
            setOTPHidden(false);
          } else {
            alert(response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };
  const confirmOTP = async () => {
    if (otp.length == 6) {
      await axios
        .post(`${variables.apiServer}/api/v1/forgot-password/verifyOTP/`, {
          email: email,
          otp: otp,
        })
        .then((response) => {
          if (response.data.isExist == true) {
            setOTPHidden(true);
            setNewPasswordHidden(false);
          } else {
            alert(response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    } else {
      alert("Please enter all 6 characters", "error");
    }
  };
  const changePassword = async () => {
    if (password == "" || password == null) {
      alert("Please enter a password", "error");
    } else if (password.length < 6) {
      alert("The password entered is less than 6 characters", "error");
    } else if (password != confirmPassword) {
      alert("Passwords dont match", "error");
    } else {
      let type = localStorage.getItem("type");
      await axios
        .post(`${variables.apiServer}/api/v1/forgot-password/resetPassword/`, {
          type: type,
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.data.updated == true) {
            history.push("/login");
          } else {
            alert(response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };
  return (
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
            <div className="w-full" hidden={emailHidden == true}>
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Forgot password
              </h1>

              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  id="email"
                  placeholder="example@example.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Label>

              <Button
                // tag={Link}
                // to="/login"
                block
                className="mt-4"
                onClick={() => confirmEmail()}
              >
                Send OTP code
              </Button>
            </div>
            <div className="w-full" hidden={otpHidden == true}>
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Verify email
              </h1>

              <Label>
                <span>Enter OTP code</span>
                <OTPInput
                  autoFocus
                  length={6}
                  className="flex px-5 mt-6"
                  inputClassName="w-1/4 h-16 text-center border-2"
                  onChangeOTP={(otp) => setOTP(otp)}
                />
              </Label>

              <Button block className="mt-4" onClick={() => confirmOTP()}>
                Verify email
              </Button>
            </div>
            <div className="w-full" hidden={newPasswordHidden == true}>
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Reset password
              </h1>

              <Label>
                <span>New password</span>
                <Input
                  className="mt-1 mb-4"
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Label>
              <Label>
                <span>Confrim new password</span>
                <Input
                  className="mt-1"
                  id="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </Label>

              <Button block className="mt-4" onClick={() => changePassword()}>
                Reset password
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
