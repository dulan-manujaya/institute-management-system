import React, { useState, useEffect } from "react";
import axios from "axios";

import PageTitle from "../../components/Typography/PageTitle";
import { Label, Select } from "@windmill/react-ui";

function Enrollment() {
  const [courses, setCourses] = useState([]);
  const [enrollCourse, setEnrollCourse] = useState("");
  const getAllCourses = async () => {
    try {
      const course = await axios.get("http://localhost:4000/api/v1/courses");
      console.log(course);
      setCourses(course.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  function courseSelect(e) {
    setEnrollCourse(e.target.value);
    console.log(e.target.value);
  }

  useEffect(() => {
    getAllCourses();
  }, []);
  return (
    <>
      <PageTitle>Enrollments</PageTitle>
      <Label className="mt-4">
        <span>Select Course</span>

        <Select
          className="mt-1"
          onChange={(e) => {
            courseSelect(e);
          }}
        >
          {courses.map((course, i) => (
            <option key={i}>{course.course_name}</option>
          ))}
        </Select>
      </Label>
    </>
  );
}

export default Enrollment;
