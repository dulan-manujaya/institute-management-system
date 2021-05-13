import { Player } from "@lottiefiles/react-lottie-player";
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select
} from "@windmill/react-ui";
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
import WordIcon from "../icons/doc.svg";
import PDFIcon from "../icons/pdf.svg";
import PPTIcon from "../icons/ppt.svg";
import ExcelIcon from "../icons/xls.svg";
import ToastMessage from "../messages/HandleMessages";

const CourseMaterial = () => {
  const { grades } = useContext(GradeContext);
  const { loggedInUser } = useContext(TeacherContext);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [available, setAvailable] = useState(true);
  const [courseMaterials, setCourseMaterials] = useState(null);

  const courseMaterialBody = {
    cm_name: title,
    course_id: courseId,
    cm_file_url: fileName,
    cm_availability: available,
    cm_submitted_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };

  const gradeSelect = (e) => {
    setGradeId(e.target.value);
    getCourseByGrade(e.target.value);
  };

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    clearForm();
  }

  function handleUpload(event) {
    var file = event.target.files[0];
    setFileName(`${variables.apiServer}/public/course-material/${file.name}`);
    setFile(file);
  }

  function clearForm() {
    setTitle("");
    setCourseId("");
    setFile("");
    setFileName("");
  }

  const getAllCourseMaterials = async () => {
    try {
      const response = await axios.get(
        `${variables.apiServer}/api/v1/coursematerials/mycoursematerials/${loggedInUser.teacher_id}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      console.log(response);
      setCourseMaterials(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const uploadCourseMaterial = async () => {
    try {
      console.log(courseMaterialBody);
      const response = await axios.post(
        `${variables.apiServer}/api/v1/coursematerials`,
        courseMaterialBody,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      console.log(response);
      handleFileSubmission(file);
      ToastMessage(response.data);
      clearForm();
      closeModal();
      getAllCourseMaterials();
    } catch (err) {
      console.log(err);
      if (err.response.data.message === "Validation failed") {
        ToastMessage(err.response.data.errors[0].msg);
      } else if (err.response.data.message === "Internal server error") {
        ToastMessage("Please select correct deadline.");
      }
    }
  };

  const handleFileSubmission = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${variables.apiServer}/api/v1/uploads/course-material`,
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
    getAllCourseMaterials();
  }, [courses, loggedInUser]);

  return (
    <>
      <PageTitle>Course Materials</PageTitle>
      <div className="flex">
        <div className="mr-6 w-1/2 mt-8 py-2 flex-shrink-0 flex flex-col bg-gray-200 dark:bg-gray-700 rounded-lg">
          <div className="">
            <h3 className="flex items-center justify-between pt-1 pb-1 px-8 text-lg font-semibold capitalize dark:text-gray-300">
              <div>
                <span>Latest Uploads</span>
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
              </div>
              <button
                className="bg-purple-800 rounded-lg py-2 px-4 text-gray-200"
                onClick={openModal}
              >
                Add New Course Material
              </button>
            </h3>
          </div>

          <div className="mt-8 flex flex-col overflow-y-auto materialrow">
            <ul className="pt-1 pb-2 px-3">
              {!courseMaterials ? (
                <div>
                  <Player
                    autoplay
                    loop
                    src="https://assets9.lottiefiles.com/packages/lf20_zxliqmhr.json"
                    style={{ height: "300px", width: "300px" }}
                  ></Player>
                  <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                      No Course Materials!
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 mt-4">
                      You have not uploaded any course materials yet.{" "}
                      <button
                        onClick={openModal}
                        className="text-purple-600 hover:underline dark:text-purple-300"
                      >
                        Upload your first document.
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                courseMaterials.map((cm) => (
                  <li className="mt-2" key={cm.cm_id}>
                    <div className="p-5 flex flex-col justify-between bg-gray-100 dark:bg-gray-600 rounded-lg">
                      <div className="flex items-start justify-between font-semibold capitalize dark:text-gray-300">
                        <span>{cm.cm_name}</span>
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 fill-current mr-1 text-gray-600 dark:text-gray-200"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14 12l-4-4v3H2v2h8v3m12-4a10 10 0 01-19.54 3h2.13a8 8 0 100-6H2.46A10 10 0 0122 12z" />
                          </svg>
                          <a href={cm.cm_file_url} target="_blank">
                            <span>Download</span>
                          </a>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex justify-center">
                          {cm.cm_file_url.includes("pdf") ? (
                            <img src={PDFIcon} width="50px" className="mr-4" />
                          ) : cm.cm_file_url.includes("xls") ? (
                            <img
                              src={ExcelIcon}
                              width="50px"
                              className="mr-4"
                            />
                          ) : cm.cm_file_url.includes("ppt") ? (
                            <img src={PPTIcon} width="50px" className="mr-4" />
                          ) : cm.cm_file_url.includes("doc") ? (
                            <img src={WordIcon} width="50px" className="mr-4" />
                          ) : cm.cm_file_url.includes("docx") ? (
                            <img src={WordIcon} width="50px" className="mr-4" />
                          ) : cm.cm_file_url.includes("csv") ? (
                            <img
                              src={ExcelIcon}
                              width="50px"
                              className="mr-4"
                            />
                          ) : null}

                          {loggedInUser ? (
                            <div className="items-center mt-2 ml-4">
                              <span className="dark:text-green-400 text-green-600 font-semibold">
                                {`By ${loggedInUser.first_name} ${loggedInUser.last_name}`}
                              </span>{" "}
                              <span className="dark:text-gray-400">
                                for {cm.grade_name}
                              </span>
                            </div>
                          ) : null}
                        </div>
                        <p className="text-sm font-medium leading-snug text-gray-600 dark:text-gray-300">
                          <Moment fromNow>{cm.cm_submitted_date}</Moment>
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div
          className="mr-6 w-1/2 mt-8 py-2 flex-shrink-0 flex flex-col
				bg-purple-300 rounded-lg text-white dark:text-gray-600"
        >
          <h3
            className="flex items-center pt-1 pb-1 px-8 text-lg font-semibold
					capitalize"
          >
            <span>scheduled lessons</span>
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
          <div className="flex flex-col items-center mt-12">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png"
              alt=" empty schedule"
            />
            <span className="font-bold mt-8">Your schedule is empty</span>
            <span className="text-purple-500">Make your first appointment</span>
            <button className="mt-8 bg-purple-800 rounded-lg py-2 px-4 dark:text-gray-200">
              Add New Course Material
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Submit Course Material</ModalHeader>
        <ModalBody>
          <div className=" px-4 py-3 mb-8 bg-gray-200 rounded-lg shadow-md dark:bg-gray-800 ">
            <div className="-mx-3 md:flex mb-6 mt-4">
              <div className="md:w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                  htmlFor="grid-grade"
                >
                  Grade
                </label>
                <Select
                  className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
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
                  className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2"
                  htmlFor="grid-grade"
                >
                  Course
                </label>
                <Select
                  className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
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

            <Label className="mt-4 mb-4 text-align: left max-w-md">
              <span>Course Material Title</span>
              <Input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                placeholder="Maths Geometry"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Label>
            <Label className="mt-4 text-align: left max-w-md">
              <span>Upload File</span>
            </Label>
            <div className="flex items-start">
              <div className="mb-2">
                {" "}
                <div className="relative h-40 rounded-lg border-dashed border-2 border-gray-700 dark:border-gray-200 bg-gray-200 dark:bg-gray-700 flex justify-center items-center hover:cursor-pointer">
                  <div className="absolute">
                    <div className="flex flex-col items-center ">
                      {" "}
                      <i className="fa fa-cloud-upload fa-3x text-gray-200" />{" "}
                      <span className="block text-gray-700 dark:text-gray-400 font-normal">
                        Attach you files here
                      </span>{" "}
                      <span className="block text-gray-700 font-normal">
                        or
                      </span>{" "}
                      <span className="block text-blue-700 font-normal">
                        Browse files
                      </span>{" "}
                    </div>
                  </div>{" "}
                  <input
                    onChange={handleUpload}
                    type="file"
                    className="h-full w-full opacity-0"
                  />
                </div>
              </div>
              <div className="items-left text-gray-700 dark:text-gray-400 mt-6 ml-8">
                {" "}
                <span>Accepted file type:.doc only</span>{" "}
                <p>Filename: {file.name}</p>
                <p>File type: {file.type}</p>
                <p>File size: {file.size} bytes</p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              iconLeft={UploadIcon}
              className="text-white"
              onClick={() => {
                if (title !== "" || title !== "") {
                }
                uploadCourseMaterial();
              }}
            >
              <span>Upload</span>
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default CourseMaterial;
