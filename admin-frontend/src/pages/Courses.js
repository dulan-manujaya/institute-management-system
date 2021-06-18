import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ToastMessage from "../messages/HandleMessages";
import { ToastContainer } from "react-toastify";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Pagination,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@windmill/react-ui";
import variables from "../common/globalVariables";
import PageTitle from "../components/Typography/PageTitle";
import { TrashIcon } from "../icons";

const Courses = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const resultsPerPage = 9;

  const onPageChange = (p) => {
    setPage(p);
  };

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const getAllCourses = async () => {
    try {
      const courses = await axios.get(`${variables.apiServer}/api/v1/courses`);
      console.log(courses.data);
      setData(
        courses.data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      setTotalResults(courses.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCourse = async (id) => {
    const token = sessionStorage.getItem("adminAccessToken");
    await axios
      .delete(`${variables.apiServer}/api/v1/courses/id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        ToastMessage(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response) {
          ToastMessage(err.response.data.message);
        }
      })
      .finally(() => {
        getAllCourses();
        closeModal();
      });
  };

  useEffect(() => {
    getAllCourses();
  }, [page]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Delete Course : {selectedName}</ModalHeader>
        <ModalBody>Are you sure you want to delete this course?</ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              iconLeft={TrashIcon}
              className="text-white"
              onClick={() => {
                deleteCourse(selectedId);
              }}
            >
              <span>Delete</span>
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <PageTitle>Courses</PageTitle>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          {data ? (
            <TableBody>
              {data.map((course, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <span className="text-sm">{course.course_name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">LKR {course.amount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{course.description}</span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/app/course-details/${course.course_id}`}>
                      <Button className="mr-4" size="small">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      // onClick={() => {
                      //   deleteCourse(course.course_id);
                      // }}
                      onClick={() => {
                        setSelectedId(course.course_id);
                        setSelectedName(course.course_name);
                        openModal();
                      }}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
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

export default Courses;
