import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { SidebarContext } from "../context/SidebarContext";
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
} from "../icons";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  WindmillContext,
} from "@windmill/react-ui";

function Header() {
  const history = useHistory();
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const [userType, setUserType] = useState();

  const [studentId, setStudentId] = useState("0");
  const [studentName, setStudentName] = useState("");
  const [studentAvatar, setStudentAvatar] = useState("");

  const [teacherId, setTeacherId] = useState("0");
  const [teacherName, setTeacherName] = useState("");

  const [parentId, setParentId] = useState("0");
  const [parentEmail, setParentEmail] = useState("");

  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  }

  const getStudentId = async () => {
    try {
      const token = sessionStorage.getItem("studentAccessToken");
      const currStudent = await axios.get(
        "http://localhost:4000/api/v1/students/whoami",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sid = currStudent.data.student_id;
      setStudentId(sid);
      const fName = currStudent.data.first_name;
      const lName = currStudent.data.last_name;
      const fullname = fName + " " + lName;
      setStudentName(fullname);
      setStudentAvatar(currStudent.data.avatar);
    } catch (err) {
      console.log(err);
      history.push("/login");
    }
  };

  const getTeacherId = async () => {
    try {
      const token = sessionStorage.getItem("teacherAccessToken");
      const currTeacher = await axios.get(
        "http://localhost:4000/api/v1/teachers/whoami",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const tid = currTeacher.data.teacher_id;
      const fName = currTeacher.data.first_name;
      const lName = currTeacher.data.last_name;
      const fullname = fName + " " + lName;
      setTeacherName(fullname);
      setTeacherId(tid);
    } catch (err) {
      console.log(err);
      history.push("/login");
    }
  };

  const getParentId = async () => {
    try {
      const token = sessionStorage.getItem("parentAccessToken");
      const currParent = await axios.get(
        "http://localhost:4000/api/v1/parents/whoami",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const pid = currParent.data.guardian_id;
      const pemail = currParent.data.guardian_email;
      setParentEmail(pemail);
      setParentId(pid);
    } catch (err) {
      console.log(err);
      history.push("/login");
    }
  };

  const logOut = () => {
    sessionStorage.removeItem("studentAccessToken");
    sessionStorage.removeItem("teacherAccessToken");
    sessionStorage.removeItem("parentAccessToken");
    window.location.reload();
  };

  const profile = () => {
    history.push("/app/profile");
  };

  useEffect(() => {
    let type =
      localStorage.getItem("type") == undefined || null
        ? "student"
        : localStorage.getItem("type");
    localStorage.setItem("type", type);
    setUserType(type);
    if (type == "student") {
      getStudentId();
    }
    if (type == "teacher") {
      getTeacherId();
    }
    if (type == "parent") {
      getParentId();
    }
  }, [studentId, teacherId, parentId]);

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* <!-- Mobile hamburger --> */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        {/* <!-- Search input --> */}
        <div className="flex justify-center flex-1 lg:mr-32">
          {/* <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search for projects"
              aria-label="Search"
            />
          </div> */}
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}

          {/* <!-- Profile menu --> */}
          <li className="relative">
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              <a className="mr-6 text-lg font-bold text-gray-800 dark:text-gray-200">
                {userType == "student"
                  ? studentName
                  : userType == "teacher"
                  ? teacherName
                  : parentEmail}
              </a>
              <div hidden={userType != "student"}>
                <Avatar
                  className="align-middle"
                  src={studentAvatar}
                  alt=""
                  aria-hidden="true"
                />
              </div>
            </button>
            <Dropdown
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            >
              <div hidden={userType != "student"}>
                <DropdownItem
                  onClick={() => profile()}
                  hidden={userType != "student"}
                >
                  <OutlinePersonIcon
                    className="w-4 h-4 mr-3"
                    aria-hidden="true"
                  />
                  <span>Profile</span>
                </DropdownItem>
              </div>

              <DropdownItem onClick={() => logOut()}>
                <OutlineLogoutIcon
                  className="w-4 h-4 mr-3"
                  aria-hidden="true"
                />
                <span>Log out</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
