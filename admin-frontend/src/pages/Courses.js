import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
} from "@windmill/react-ui";
import variables from "../common/globalVariables";
import PageTitle from "../components/Typography/PageTitle";
import { TrashIcon } from "../icons";

const Courses = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  const resultsPerPage = 9;

  const onPageChange = (p) => {
    setPage(p);
  };

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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <>
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
                      onClick={() => {
                        deleteCourse(course.course_id);
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
    </>
  );
};

export default Courses;
