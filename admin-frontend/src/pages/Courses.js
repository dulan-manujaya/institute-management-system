import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Pagination,
  Select,
  Button,
} from "@windmill/react-ui";
import variables from "../common/globalVariables";
import PageTitle from "../components/Typography/PageTitle";

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
