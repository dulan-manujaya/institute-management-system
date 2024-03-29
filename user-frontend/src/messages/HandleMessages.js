import React from "react";
import { ErrorMessages, SuccessMessages, InfoMessages } from "./Messages";
import { toast } from "react-toastify";
import Alert from "../components/Alert/Alert";
import "react-toastify/dist/ReactToastify.css";

const alert = (message, type) => {
  toast(<Alert type={type} message={message} />, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });
};

const ToastMessage = (toast_msg) => {
  switch (true) {
    //Error
    case /Incorrect integer value: '' for column 'student_id'/.test(toast_msg):
      alert(ErrorMessages.noStudentId, "error");
      break;
    case /Incorrect integer value: '' for column 'course_id'/.test(toast_msg):
      alert(ErrorMessages.noCourseId, "error");
      break;
    case /Duplicate entry/.test(toast_msg) && /enrollments.df/.test(toast_msg):
      alert(ErrorMessages.duplicateEnrollment, "error");
      break;
    case /Duplicate entry/.test(toast_msg) && /student.email/.test(toast_msg):
      alert(ErrorMessages.duplicateEmail, "error");
      break;
    case /Duplicate entry/.test(toast_msg) && /student.mobile/.test(toast_msg):
      alert(ErrorMessages.duplicateMobile, "error");
      break;
    case /Course is required/.test(toast_msg):
      alert(ErrorMessages.noCourseId, "error");
      break;
    case /Title can not be empty/.test(toast_msg):
      alert(ErrorMessages.titleEmpty, "error");
      break;
    case /Document can not be empty/.test(toast_msg):
      alert(ErrorMessages.documentEmpty, "error");
      break;
    case /Please select correct deadline/.test(toast_msg):
      alert(ErrorMessages.deadline, "error");
      break;
    //Success
    case /Enrollment is created/.test(toast_msg):
      alert(SuccessMessages.enrollmentCreated, "success");
      break;
    case /Student was created/.test(toast_msg):
      alert(SuccessMessages.studentCreated, "success");
      break;
    case /Enrollment updated successfully/.test(toast_msg):
      alert(SuccessMessages.enrollmentUpdated, "success");
      break;
    case /Assignment was created/.test(toast_msg):
      alert(SuccessMessages.assignmentCreated, "success");
      break;
    case /Course Material was created/.test(toast_msg):
      alert(SuccessMessages.courseMaterialCreated, "success");
      break;
    // Info
    case /Enrollment has been deleted/.test(toast_msg):
      alert(InfoMessages.enrollmentDeleted, "info");
      break;
  }
};

export default ToastMessage;
