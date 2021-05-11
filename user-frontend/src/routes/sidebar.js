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
    path: "/app/courses",
    icon: "CardsIcon",
    name: "Courses",
  },
  {
    path: "/app/students",
    icon: "PeopleIcon",
    name: "Students",
  },
  {
    path: "/app/results",
    icon: "FormsIcon",
    name: "Results",
  },
  {
    path: "/app/exams",
    icon: "ChartsIcon",
    name: "Reports",
  },
];

export default routes;
