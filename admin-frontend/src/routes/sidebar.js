/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    icon: "PeopleIcon",
    name: "Teacher Management",
    routes: [
      // submenu
      {
        path: "/app/teacher-admission",
        name: "Add Teacher",
      },
      {
        path: "/app/teachers",
        name: "Teacher Details",
      },
    ],
  },
  {
    icon: "PeopleIcon",
    name: "Student Management",
    routes: [
      // submenu
      {
        path: "/app/student-admission",
        name: "Student Admissions",
      },
      // {
      //   path: "/app/course-admission",
      //   name: "Course Enrollments",
      // },
      // {
      //   path: "/app/pending-enrollments",
      //   name: "Pending Enrollments",
      // },
      {
        path: "/app/students",
        name: "Student Details",
      },
      // {
      //   path: "/app/404",
      //   name: "Blocked Students",
      // },
    ],
  },
  // {
  //   icon: "DownloadIcon",
  //   name: "Download Center",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/app/assignments",
  //       name: "Assignments",
  //     },
  //     {
  //       path: "/app/course-material",
  //       name: "Course Materials",
  //     },
  //     {
  //       path: "/app/student-assignment-submissions",
  //       name: "Student Submissions",
  //     },
  //     {
  //       path: "/app/404",
  //       name: "Other",
  //     },
  //   ],
  // },
  // {
  //   path: "/app/chat",
  //   icon: "ChatIcon",
  //   name: "Conversations",
  // },
  {
    path: "/app/add-results", // the url
    icon: "FormsIcon", // the component being exported from icons/index.js
    name: "Results", // name that appear in Sidebar
  },
  {
    path: "/app/mark-attendance",
    icon: "PeopleIcon",
    name: "Attendance",
  },
  {
    icon: "CardsIcon",
    name: "Courses",
    routes: [
      // submenu
      {
        path: "/app/courses",
        name: "View Courses",
      },
      {
        path: "/app/create-course",
        name: "Create New Course",
      },
    ],
  },
  {
    icon: "FormsIcon",
    name: "Reports",
    routes: [
      // submenu
      {
        path: "/app/student-marks-reports",
        name: "Result Reports",
      },
      {
        path: "/app/create-course",
        name: "Create New Course",
      },
    ],
  },
  // {
  //   path: "/app/payments",
  //   icon: "ChartsIcon",
  //   name: "Payments",
  // },
  // {
  //   path: "/app/buttons",
  //   icon: "ButtonsIcon",
  //   name: "Buttons",
  // },
  // {
  //   path: "/app/modals",
  //   icon: "ModalsIcon",
  //   name: "Modals",
  // },
  // {
  //   path: "/app/tables",
  //   icon: "TablesIcon",
  //   name: "Tables",
  // },
  // {
  //   icon: "PagesIcon",
  //   name: "Pages",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/login",
  //       name: "Login",
  //     },
  //     {
  //       path: "/create-account",
  //       name: "Create account",
  //     },
  //     {
  //       path: "/forgot-password",
  //       name: "Forgot password",
  //     },
  //     {
  //       path: "/app/404",
  //       name: "404",
  //     },
  //     {
  //       path: "/app/blank",
  //       name: "Blank",
  //     },
  //   ],
  // },
];

export default routes;
