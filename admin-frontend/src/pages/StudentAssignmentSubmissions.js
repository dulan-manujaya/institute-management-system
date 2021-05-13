import {
  Badge,
  Button,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow
} from "@windmill/react-ui";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import variables from "../common/globalVariables";
import PageTitle from "../components/Typography/PageTitle";
import { GradeContext, TeacherContext } from "../context/Context.Index";

const StudentAssignmentSubmissions = () => {
  const { grades } = useContext(GradeContext);
  const { loggedInUser } = useContext(TeacherContext);
  const [page, setPage] = useState(1);
  const [submisisons, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignmentId, setAssignmentId] = useState("");
  const [data, setData] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [gradeId, setGradeId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [gradeSelected, setGradeSelected] = useState(false);
  const [courseSelected, setCourseSelected] = useState(false);
  const resultsPerPage = 9;

  const courseSelect = (e) => {
    setCourseId(e.target.value);
    selectAssignmentByCourse(e.target.value);
    if (e.target.value >= 0) {
      setCourseSelected(true);
    } else {
      setCourseSelected(false);
    }
  };

  const gradeSelect = (e) => {
    setGradeId(e.target.value);
    getCourseByGrade(e.target.value);
    if (e.target.value >= 0) {
      setGradeSelected(true);
    } else {
      setGradeSelected(false);
    }
  };

  const assignmentSelect = (e) => {
    setAssignmentId(e.target.value);
    selectSubmissionByAssignment(e.target.value);
  };

  function onPageChange(p) {
    setPage(p);
  }

  const selectSubmissionByAssignment = async (adm_id) => {
    try {
      const submissions = await axios.get(
        `${variables.apiServer}/api/v1/submissions/assignment/${adm_id}/teacher/${loggedInUser.teacher_id}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setSubmissions(submissions.data);
    } catch (err) {
      console.log(err);
    }
  };

  const selectAssignmentByCourse = async (course_id) => {
    try {
      const assignments = await axios.get(
        `${variables.apiServer}/api/v1/assignments/myassignments/${loggedInUser.teacher_id}/course/${course_id}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setAssignments(assignments.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getMySubmissions = async () => {
    try {
      const submissions = await axios.get(
        `${variables.apiServer}/api/v1/submissions/teacher/${loggedInUser.teacher_id}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setData(
        submissions.data.slice(
          (page - 1) * resultsPerPage,
          page * resultsPerPage
        )
      );
      setSubmissions(submissions.data);
      // setTotalResults(submissions.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  const getCourseByGrade = async (id) => {
    try {
      const course = await axios.get(
        `${variables.apiServer}/api/v1/courses/mycourses/${loggedInUser.teacher_id}/grade/${id}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      console.log(course);
      setCourses(course.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getMySubmissions();
  }, [page, grades, loggedInUser]);
  return (
    <>
      <PageTitle>Student Assignment Submissions</PageTitle>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex-1 pr-4 mb-4">
          <Select
            className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
            onChange={(e) => {
              gradeSelect(e);
            }}
            value={gradeId}
          >
            <option value={-1}>Select Grade</option>
            {!grades
              ? null
              : grades
                  .sort((a, b) => a.grade_id - b.grade_id)
                  .map((grade) => (
                    <option value={grade.grade_id} key={grade.grade_id}>
                      {grade.grade_name}
                    </option>
                  ))}
          </Select>
        </div>

        <div className="flex-1 pr-4 mb-4">
          <Select
            disabled={!gradeSelected}
            className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
            onChange={(e) => {
              courseSelect(e);
            }}
            value={courseId}
          >
            <option value={-1}>Select Course</option>
            {!courses
              ? null
              : courses.map((course) => (
                  <option value={course.course_id} key={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
          </Select>
        </div>

        <div className="flex-1 pr-4 mb-4">
          <Select
            disabled={!courseSelected}
            className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
            onChange={(e) => {
              assignmentSelect(e);
            }}
            value={assignmentId}
          >
            <option value={-1}>Select Assignment</option>
            {!assignments
              ? null
              : assignments.map((assignment) => (
                  <option
                    value={assignment.assignment_id}
                    key={assignment.assignment_id}
                  >
                    {assignment.title}
                  </option>
                ))}
          </Select>
        </div>

        <div className="mb-4">
          <Button onClick={() => {}}>Clear Filters / Refresh List</Button>
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr className="text-gray-700 dark:text-gray-200">
              <TableCell>Title</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Uploaded On</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Is Deadline Passed</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          {!submisisons ? null : (
            <TableBody>
              {submisisons.map((submission, i) => (
                <TableRow key={i} className="text-gray-700 dark:text-gray-300">
                  <TableCell>
                    <span className="text-sm">{submission.title}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{submission.course_name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {submission.student_auth_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(submission.submitted_date).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(submission.deadline).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {!submission.is_deadline_passed ? (
                        <Badge type="success">No</Badge>
                      ) : (
                        <Badge type="danger">Yes</Badge>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <a target="_blank" href={submission.submission_url}>
                        {" "}
                        <Button size="small">View</Button>
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </>
  );
};

export default StudentAssignmentSubmissions;
