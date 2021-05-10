import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../components/Typography/PageTitle";

const Profile = () => {
  const [studentId, setStudentId] = useState("0");
  const [studentObject, setStudentObject] = useState({});
  const [studentRegisteredDate, setStudentRegisteredDate] = useState(new Date());
  const [studentBirthDate, setStudentBirthDate] = useState(new Date());

  const getStudentId = async () => {
    const token = sessionStorage.getItem("studentAccessToken");
    const currStudentId = await axios.get(
      "http://localhost:4000/api/v1/students/whoami",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const sid = currStudentId.data.student_id;
    const currStudent = await axios.get(
      "http://localhost:4000/api/v1/students/id/" + sid
    );
    setStudentId(sid);
    setStudentObject(currStudent.data);
    setStudentRegisteredDate(new Date(currStudent.data.registered_date));
    setStudentBirthDate(new Date(currStudent.data.date_of_birth));
  };
  useEffect(() => {
    getStudentId();
  }, []);
  return (
    <>
    
      <PageTitle>Profile</PageTitle>
      <div className="bg-gray-800">
        <div className="container mx-auto my-5 p-5">
          <div className="md:flex no-wrap md:-mx-2 ">
            {/* Left Side */}
            <div className="w-full md:w-3/12 md:mx-2">
              {/* Profile Card */}
              <div className="bg-gray-800 p-3">
                <div className="image overflow-hidden">
                  <img
                    className="h-auto w-full mx-auto"
                    src={studentObject.avatar}
                    alt=""
                  />
                </div>
                <h1 className="text-gray-100 font-bold text-xl leading-8 my-1">
                  {studentObject.first_name + " " + studentObject.last_name}
                </h1>

                <ul className="bg-gray-800 text-gray-200 hover:text-gray-200 hover:shadow py-2 mt-3 divide-y rounded shadow-sm">
                  <li className="flex items-center py-3">
                    <span>Member since</span>
                    <span className="ml-auto">{studentRegisteredDate.toLocaleDateString()}</span>
                  </li>
                </ul>
              </div>
              {/* End of profile card */}
            </div>
            {/* Right Side */}
            <div className="w-full md:w-9/12 mx-2 h-64">
              {/* Profile tab */}
              {/* About Section */}
              <div className="bg-gray-800 p-3 shadow-sm rounded-sm">
                <div className="flex items-center space-x-2 font-semibold text-gray-100 leading-8">
                  <span clas="text-green-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      a
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">About</span>
                </div>
                <div className="text-gray-100">
                  <div className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">First Name</div>
                      <div className="px-4 py-2">{studentObject.first_name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Last Name</div>
                      <div className="px-4 py-2">{studentObject.last_name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Gender</div>
                      <div className="px-4 py-2">{studentObject.gender}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Contact No.</div>
                      <div className="px-4 py-2">{studentObject.mobile}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Current Address
                      </div>
                      <div className="px-4 py-2">
                        Beech Creek, PA, Pennsylvania
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Permanant Address
                      </div>
                      <div className="px-4 py-2">
                        Arlington Heights, IL, Illinois
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Email.</div>
                      <div className="px-4 py-2">
                        <a
                          className="text-blue-800"
                          href={`mailto:${studentObject.email}`}
                        >
                          {studentObject.email}
                        </a>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Birthday</div>
                      <div className="px-4 py-2">{studentBirthDate.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                <button className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:shadow-outline focus:bg-gray-800 hover:shadow-xs p-3 my-4">
                  Show Full Information
                </button>
              </div>
              {/* End of about section */}
              <div className="my-4" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
