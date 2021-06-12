import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const StudentResults = lazy(() => import("../pages/student/Results"));
const StudentResultsReport = lazy(() =>
  import("../pages/student/reports/Results")
);
const StudentCourses = lazy(() => import("../pages/student/Courses"));
const StudentPayments = lazy(() => import("../pages/student/Payments"));
const TeacherResultsReport = lazy(() =>
  import("../pages/teacher/reports/Results")
);
const TeacherAttendanceReport = lazy(() =>
  import("../pages/teacher/reports/Attendance")
);
const ParentResultsReport = lazy(() =>
  import("../pages/parent/reports/Results")
);
const ParentAttendanceReport = lazy(() =>
  import("../pages/parent/reports/Attendance")
);
const Page404 = lazy(() => import("../pages/404"));

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
    path: "/profile",
    component: Profile,
  },
  {
    path: "/student/results",
    component: StudentResults,
  },
  {
    path: "/student/courses",
    component: StudentCourses,
  },
  {
    path: "/student/payments",
    component: StudentPayments,
  },
  {
    path: "/student/reports/results",
    component: StudentResultsReport,
  },
  {
    path: "/teacher/reports/results",
    component: TeacherResultsReport,
  },
  {
    path: "/teacher/reports/attendance",
    component: TeacherAttendanceReport,
  },
  {
    path: "/parent/reports/results",
    component: ParentResultsReport,
  },
  {
    path: "/parent/reports/attendance",
    component: ParentAttendanceReport,
  },
  {
    path: "/404",
    component: Page404,
  },
];

export default routes;
