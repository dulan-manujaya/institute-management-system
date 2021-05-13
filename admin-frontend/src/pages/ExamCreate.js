import { Player } from "@lottiefiles/react-lottie-player";
import { Button, Input, Label, Select } from "@windmill/react-ui";
import axios from "axios";
import moment from "moment";
import "moment-timezone";
import React, { useContext, useEffect, useState } from "react";
import Moment from "react-moment";
import { ToastContainer } from "react-toastify";
import variables from "../common/globalVariables";
import PageTitle from "../components/Typography/PageTitle";
import { GradeContext, TeacherContext } from "../context/Context.Index";
import { UploadIcon } from "../icons";
import ToastMessage from "../messages/HandleMessages";
import createExamLottie from "../assets/lottie/create-exam.json";

const ExamCreate = () => {
  const { grades } = useContext(GradeContext);
  const { loggedInUser } = useContext(TeacherContext);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState(0);
  const [examDate, setExamDate] = useState("");

  const examBody = {
    course_id: courseId,
    exam_title: title,
    exam_date: examDate,
    exam_start_time: startTime,
    exam_end_time: endTime,
    exam_duration: duration,
    paper_url: fileName,
    exam_submitted_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };

  const gradeSelect = (e) => {
    setGradeId(e.target.value);
    getCourseByGrade(e.target.value);
  };

  function handleUpload(event) {
    var file = event.target.files[0];
    setFileName(`${variables.apiServer}/public/exam-paper/${file.name}`);
    setFile(file);
  }

  function clearForm() {
    setTitle("");
    setCourseId("");
    setFile("");
    setFileName("");
    setStartTime("");
    setEndTime("");
    setExamDate("");
  }

  const uploadExamPaper = async () => {
    try {
      console.log(examBody);
      const response = await axios.post(
        `${variables.apiServer}/api/v1/exams`,
        examBody,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      console.log(response);
      handleFileSubmission(file);
      // ToastMessage(response.data);
      // clearForm();
    } catch (err) {
      console.log(err.response);
      if (err.response.data.message === "Validation failed") {
        ToastMessage(err.response.data.errors[0].msg);
      } else if (err.response.data.message === "Internal server error") {
        ToastMessage("Please select correct deadline.");
      }
    }
  };

  function calculateDuration(start_time, end_time) {
    if (start_time !== "") {
      if (start_time >= end_time) {
        ToastMessage("Start time cannot be greater than end time.");
      } else {
        console.log("Start:" + start_time);
        console.log("End:" + end_time);
        setDuration(120);
      }
    }
  }

  const handleFileSubmission = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${variables.apiServer}/api/v1/uploads/exam-paper`,
        formData
      );
      if (response) {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCourseByGrade = async (grade_id) => {
    try {
      const course = await axios.get(
        `${variables.apiServer}/api/v1/courses/mycourses/${loggedInUser.teacher_id}/grade/${grade_id}`,
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
    calculateDuration(startTime, endTime);
  }, [startTime, endTime, examDate]);

  return (
    <>
      <PageTitle>Create New Exam</PageTitle>
      <div className="flex-shrink-0 flex flex-col dark:bg-gray-700 bg-purple-300 rounded-lg">
        <div className="flex">
          <div className="mr-6 w-1/2 py-2">
            <h3 className="flex items-center pt-1 pb-1 px-8 text-lg font-semibold capitalize dark:text-gray-300">
              <span>scheduled exam</span>
              <button className="ml-2">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 256 512">
                  <path
                    d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9
								0l-22.6-22.6c-9.4-9.4-9.4-24.6
								0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6
								0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136
								136c9.5 9.4 9.5 24.6.1 34z"
                  />
                </svg>
              </button>
            </h3>
            <div className="flex flex-col items-center">
              <Player
                autoplay
                loop
                src={createExamLottie}
                style={{ height: "600px", width: "600px" }}
              ></Player>
            </div>
          </div>
          <div className="mr-6 w-1/2 py-2">
            <div className="-mx-3 md:flex mb-6 mt-4 dark:text-gray-400 text-gray-700">
              <div className="md:w-full px-3">
                <label
                  className="block uppercase tracking-wide text-xs font-bold mb-2"
                  htmlFor="grid-grade"
                >
                  Grade
                </label>
                <Select
                  className="block appearance-none w-full border py-3 px-4 pr-8 rounded"
                  value={gradeId}
                  onChange={(e) => {
                    gradeSelect(e);
                  }}
                >
                  <option>Select Grade</option>
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
              <div className="md:w-full px-3">
                <label
                  className="block uppercase tracking-wide text-xs font-bold mb-2"
                  htmlFor="grid-grade"
                >
                  Course
                </label>
                <Select
                  className="block appearance-none w-full border py-3 px-4 pr-8 rounded"
                  onChange={(e) => {
                    setCourseId(e.target.value);
                  }}
                  value={courseId}
                >
                  <option>Select Course</option>
                  {courses.map((course) => (
                    <option value={course.course_id} key={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <Label className="mt-4 mb-4 text-align: left max-w-md dark:text-gray-400 text-gray-700">
              <span>Exam Title</span>
              <Input
                className="appearance-none block w-full border rounded py-3 px-4 mt-2"
                placeholder="IDM-69 20210414"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Label>
            <Label className="mt-4 mb-4 text-align: left max-w-md dark:text-gray-400 text-gray-700">
              <span>Exam Date</span>
              <Input
                className="appearance-none block w-full border rounded py-3 px-4 mt-2"
                type="date"
                value={examDate}
                onChange={(e) => {
                  setExamDate(e.target.value);
                }}
              />
            </Label>
            <div className="-mx-3 md:flex mt-4 dark:text-gray-400 text-gray-700">
              <div className="md:w-full px-3">
                <label
                  className="block uppercase tracking-wide text-xs font-bold mb-2"
                  htmlFor="grid-grade"
                >
                  Start Time
                </label>
                <Input
                  className="block appearance-none w-full border py-3 px-4 pr-8 rounded dark:bg-gray-700 dark:text-gray-400"
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                  }}
                />
              </div>
              <div className="md:w-full px-3">
                <label
                  className="block uppercase tracking-wide text-xs font-bold mb-2"
                  htmlFor="grid-grade"
                >
                  End Time
                </label>
                <Input
                  className="block appearance-none w-full border py-3 px-4 pr-8 rounded dark:bg-gray-700 dark:text-gray-400"
                  type="time"
                  onChange={(e) => {
                    setEndTime(e.target.value);
                  }}
                  value={endTime}
                />
              </div>
            </div>
            <Label className="mb-4 mt-4 text-align: left max-w-md dark:text-gray-400 text-gray-700">
              <span>Upload File</span>
              <Input
                className="appearance-none block w-full mt-2 bg-white text-grey-darker border border-red rounded py-3 px-4"
                type="file"
                onChange={(e) => {
                  handleUpload(e);
                }}
              />
            </Label>
            <Label className="mb-6 mt-4 text-align: left max-w-md dark:text-gray-400 text-gray-700">
              <span>Exam Duration: {duration} mins</span>
            </Label>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="mr-5 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-md"
                type="button"
                onClick={() => {}}
              >
                Clear Form
              </button>
              <button
                type="submit"
                onClick={() => {
                  uploadExamPaper();
                }}
                className="mr-5 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg"
              >
                Schedule Exam
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ExamCreate;
