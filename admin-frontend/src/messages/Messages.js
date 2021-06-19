export const ErrorMessages = {
  generalError: "Unable to perform this action",
  validationFailed: "Validation failed",
  noStudentId: "Please select a student to continue.",
  noCourseId: "Please select a course to continue.",
  noGradeId: "Please select a grade to continue.",
  cantProcessRequest: "Unable to process the request. Please try again!",
  cantDeleteStudent: "Unable to delete the student.",
  cantUpdateCourse: "Unable to update the course.",
  cantUpdateStudent: "Unable to update the student.",
  duplicateEnrollment:
    "There student is already enrolled for the selected course.",
  defaultError: "Error occurred. Please try again!",
  duplicateEmail: "This email address is already registered.",
  duplicateMobile: "This mobile number is already registered.",
  titleEmpty: "Assignment title cannot be empty",
  examTitleEmpty: "Exam title cannot be empty",
  examDateEmpty: "Exam date cannot be empty",
  examStartTimeEmpty: "Exam start time cannot be empty",
  examEndTimeEmpty: "Exam end time cannot be empty",
  examPapersEmpty: "Exam paper number cannot be empty",
  documentEmpty: "Assignment document cannot be empty",
  deadline: "Please select a deadline to continue",
};

export const SuccessMessages = {
  enrollmentCreated: "Student enrolled for the selected course successfully.",
  enrollmentUpdated: "Student accepted for the selected course successfully.",
  studentCreated: "Student has been created successfully.",
  assignmentCreated: "Assignment has been submitted successfully.",
  courseMaterialCreated: "CourseMaterial has been submitted successfully.",
  courseCreated: "Course has been created successfully",
  attendanceCreated: "Attendance has been submitted successfully",
  teacherCreated: "Teacher has been created successfully",
  teacherUpdated: "Teacher has been updated successfully",
  studentUpdated: "Student has been updated successfully",
  examCreated: "Exam has been created successfully",
  courseUpdated: "Course has been updated successfully",
  resultCreated: " Marks have been addded successfully",
};

export const InfoMessages = {
  enrollmentDeleted:
    "Student has been declined from the selected course successfully.",
  courseDeleted: "Course has been deleted successfully",
  greaterStartTime: "Start time cannot be greater than end time.",
};
