import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Assignments = lazy(() => import("../pages/Assignments"));
const StudentAdmission = lazy(() => import("../pages/StudentAdmission"));
const CourseAdmission = lazy(() => import("../pages/CourseAdmission"));
const Chat = lazy(() => import("../pages/Chat"));
const CourseMaterial = lazy(() => import("../pages/CourseMaterial"));
const Payments = lazy(() => import("../pages/Payments"));
const Buttons = lazy(() => import("../pages/Buttons"));
const Modals = lazy(() => import("../pages/Modals"));
const PendingStudents = lazy(() => import("../pages/PendingStudents"));
const PendingEnrollments = lazy(() => import("../pages/PendingEnrollments"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
const Students = lazy(() => import("../pages/Students"));
const StudentDetails = lazy(() => import("../pages/StudentDetails"));
const ExamCreate = lazy(() => import("../pages/ExamCreate"));
const StudentAssignmentSubmissions = lazy(() =>
  import("../pages/StudentAssignmentSubmissions")
);
const TeacherAdmission = lazy(() => import("../pages/AddTeacher"));
const Teachers = lazy(() => import("../pages/Teachers"));
const EditTeacher = lazy(() => import("../pages/EditTeacher"));
const Courses = lazy(() => import("../pages/Courses"));
const CreateCourse = lazy(() => import("../pages/CreateCourse"));

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/student-admission",
    component: StudentAdmission,
  },
  {
    path: "/teachers",
    component: Teachers,
  },
  {
    path: "/edit-teacher/:teacherid",
    component: EditTeacher,
  },
  {
    path: "/teacher-admission",
    component: TeacherAdmission,
  },
  {
    path: "/student-details/:studentid",
    component: StudentDetails,
  },
  {
    path: "/course-admission",
    component: CourseAdmission,
  },
  {
    path: "/assignments",
    component: Assignments,
  },
  {
    path: "/course-material",
    component: CourseMaterial,
  },
  {
    path: "/student-assignment-submissions",
    component: StudentAssignmentSubmissions,
  },
  {
    path: "/chat",
    component: Chat,
  },
  {
    path: "/create-exam",
    component: ExamCreate,
  },
  {
    path: "/students",
    component: Students,
  },
  {
    path: "/payments",
    component: Payments,
  },
  {
    path: "/buttons",
    component: Buttons,
  },
  {
    path: "/modals",
    component: Modals,
  },
  {
    path: "/pending-students",
    component: PendingStudents,
  },
  {
    path: "/pending-enrollments",
    component: PendingEnrollments,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
  {
    path: "/courses",
    component: Courses,
  },
  {
    path: "/create-course",
    component: CreateCourse,
  },
];

export default routes;
