import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Profile = lazy(() => import('../pages/Profile'))
const StudentResults = lazy(() => import('../pages/student/Results'))
const StudentExams = lazy(() => import('../pages/student/Exams'))
const StudentCourses = lazy(() => import('../pages/student/Courses'))
const StudentPayments = lazy(() => import('../pages/student/Payments'))
const StudentEnrollment = lazy(() => import('../pages/student/Enrollments'))
const TeacherCourses = lazy(() => import('../pages/teacher/Courses'))
const TeacherStudents = lazy(() => import('../pages/teacher/Students'))
const ParentChildren = lazy(() => import('../pages/parent/Children'))
const Charts = lazy(() => import('../pages/Charts'))
const Buttons = lazy(() => import('../pages/Buttons'))
const PendingStudents = lazy(() => import('../pages/PendingStudents'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/Blank'))

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
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/student/results',
    component: StudentResults,
  },
  {
    path: '/student/exams',
    component: StudentExams,
  },
  {
    path: '/student/courses',
    component: StudentCourses,
  },
  {
    path: '/student/payments',
    component: StudentPayments,
  },
  {
    path: '/student/enrollment',
    component: StudentEnrollment,
  },
  {
    path: '/teacher/courses',
    component: TeacherCourses,
  },
  {
    path: '/teacher/students',
    component: TeacherStudents,
  },
  {
    path: '/parent/children',
    component: ParentChildren,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/buttons',
    component: Buttons,
  },
  {
    path: '/pending-students',
    component: PendingStudents,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
]

export default routes
