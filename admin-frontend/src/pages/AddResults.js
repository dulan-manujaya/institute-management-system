import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Select,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Pagination,
  Button,
} from "@windmill/react-ui";
import ToastMessage from "../messages/HandleMessages";
import { ToastContainer } from "react-toastify";

import PageTitle from "../components/Typography/PageTitle";
import variables from "../common/globalVariables";
import SectionTitle from "../components/Typography/SectionTitle";

const AddResults = () => {
  const [examTitle, setExamTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [examId, setExamId] = useState("");
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [marks, setMarks] = useState("");

  const resultsPerPage = 9;

  const onPageChange = (p) => {
    setPage(p);
  };

  const examObj = {
    exam_name: examTitle,
    course_id: courseId,
  };

  const getCourses = async () => {
    await axios
      .get(`${variables.apiServer}/api/v1/courses`)
      .then((response) => {
        console.log(response);
        setCourses(response.data);
      });
  };

  const addMarks = async (id) => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .post(
        `${variables.apiServer}/api/v1/results`,
        {
          exam_id: examId,
          student_id: id,
          marks: marks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        ToastMessage(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getStudentsByCourse = async (id) => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .get(`${variables.apiServer}/api/v1/students/course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data) {
          setData(response.data);
          setTotalResults(response.data.length);
        } else {
          setData([]);
          setTotalResults(0);
        }
      })
      .catch((error) => {
        console.log(error);
        setData([]);
        setTotalResults(0);
      });
  };

  const getExams = async (id) => {
    await axios
      .get(`${variables.apiServer}/api/v1/exams/course/${id}`)
      .then((response) => {
        console.log(response);
        setExams(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createExam = async () => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .post(`${variables.apiServer}/api/v1/exams`, examObj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        ToastMessage(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      })
      .finally(() => {
        getExams();
      });
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    getExams(courseId);
  }, [courseId]);

  useEffect(() => {
    setStudents(data.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page, data]);

  useEffect(() => {
    getStudentsByCourse(courseId);
  }, [courseId]);

  return (
    <>
      <PageTitle>Add Results</PageTitle>
      <SectionTitle>Add New Exam</SectionTitle>
      <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 flex flex-col my-2 dark:bg-gray-800">
        <div className="-mx-3 md:flex mb-6">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
              htmlFor="grid-exam-name"
            >
              Exam Title
            </label>
            <Input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4"
              id="grid-exam-name"
              type="text"
              placeholder="Mid term exam"
              value={examTitle}
              onChange={(e) => {
                setExamTitle(e.target.value);
              }}
            />
          </div>
          <div className="md:w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
              htmlFor="grid-course-amount"
            >
              Course
            </label>
            <Select
              className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
              id="grid-course"
              onChange={(e) => {
                setCourseId(e.target.value);
              }}
              value={courseId}
            >
              <option>Select Course</option>
              {courses.map((course, i) => (
                <option key={i} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </Select>
            {/* {!submitted ? null : !studentLastName ? <FormFillError /> : null} */}
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => {
              createExam();
            }}
            className="mr-5 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg"
          >
            Submit Exam
          </button>
        </div>
      </div>
      <SectionTitle>Add Marks</SectionTitle>
      <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 flex flex-col my-2 dark:bg-gray-800">
        <div className="-mx-3 md:flex mb-6">
          <div className="md:w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
              htmlFor="grid-course-amount"
            >
              Course
            </label>
            <Select
              className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
              id="grid-course"
              onChange={(e) => {
                setCourseId(e.target.value);
              }}
              value={courseId}
            >
              <option>Select Course</option>
              {courses.map((course, i) => (
                <option key={i} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </Select>
            {/* {!submitted ? null : !studentLastName ? <FormFillError /> : null} */}
          </div>
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-900 dark:text-gray-200 text-xs font-bold mb-2"
              htmlFor="grid-exam-name"
            >
              Exam
            </label>
            <Select
              className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
              id="grid-exam"
              onChange={(e) => {
                setExamId(e.target.value);
              }}
              value={examId}
            >
              <option>Select Exam</option>
              {exams
                ? exams.map((exam, i) => (
                    <option key={i} value={exam.exam_id}>
                      {exam.exam_name}
                    </option>
                  ))
                : null}
            </Select>
          </div>
        </div>
      </div>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          {data && examId ? (
            <TableBody>
              {students.map((student, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <span className="text-sm">
                      {student.first_name} {student.last_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={marks}
                      onChange={(e) => {
                        setMarks(e.target.value);
                      }}
                    ></Input>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        addMarks(student.student_id);
                      }}
                      className="mr-4"
                      size="small"
                    >
                      Add Marks
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : null}
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
      <ToastContainer />
    </>
  );
};

export default AddResults;
