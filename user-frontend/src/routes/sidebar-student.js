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
    path: "/app/student/courses",
    icon: "CardsIcon",
    name: "Courses",
  },
  // {
  //   path: "/app/student/results",
  //   icon: "FormsIcon",
  //   name: "Results",
  // },
  {
    path: "/app/student/payments",
    icon: "MoneyIcon",
    name: "Payments",
  },
  {
    icon: "ChartsIcon",
    name: "Reports",
    routes: [
      // submenu
      {
        path: "/app/student/reports/results",
        name: "Results",
      },
    ],
  },
];

export default routes;
