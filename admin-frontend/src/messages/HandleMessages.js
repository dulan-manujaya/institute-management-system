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
  console.log(toast_msg);
  switch (true) {
    //Error
    case /Internal server error/.test(toast_msg):
      alert(ErrorMessages.generalError, "error");
      break;
    case /Incorrect integer value: '' for column 'student_id'/.test(toast_msg):
      alert(ErrorMessages.noStudentId, "error");
      break;
    case /Validation failed/.test(toast_msg):
      alert(ErrorMessages.validationFailed, "error");
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
    case /Exam Title can not be empty/.test(toast_msg):
      alert(ErrorMessages.examTitleEmpty, "error");
      break;
    case /Exam date can not be empty/.test(toast_msg):
      alert(ErrorMessages.examDateEmpty, "error");
      break;
    case /Exam start time cannot be empty/.test(toast_msg):
      alert(ErrorMessages.examStartTimeEmpty, "error");
      break;
    case /Exam end time cannot be empty/.test(toast_msg):
      alert(ErrorMessages.examEndTimeEmpty, "error");
      break;
    case /Exam paper can not be empty/.test(toast_msg):
      alert(ErrorMessages.examEndTimeEmpty, "error");
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
    case /Course was created/.test(toast_msg):
      alert(SuccessMessages.courseCreated, "success");
      break;
    case /Teacher was created/.test(toast_msg):
      alert(SuccessMessages.teacherCreated, "success");
      break;
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
    case /Attendance was created/.test(toast_msg):
      alert(SuccessMessages.attendanceCreated, "success");
      break;
    case /Teacher updated successfully/.test(toast_msg):
      alert(SuccessMessages.teacherUpdated, "success");
      break;
    // Info
    case /Enrollment has been deleted/.test(toast_msg):
      alert(InfoMessages.enrollmentDeleted, "info");
      break;
    case /Course has been deleted/.test(toast_msg):
      alert(InfoMessages.courseDeleted, "info");
      break;
    case /Start time cannot be greater than end time/.test(toast_msg):
      alert(InfoMessages.greaterStartTime, "info");
      break;
  }
};

export default ToastMessage;
