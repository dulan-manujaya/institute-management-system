import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import { ChatIcon, MenuIcon, MoneyIcon, PeopleIcon } from "../icons";
import RoundIcon from "../components/RoundIcon";
import { TeacherContext } from "../context/Context.Index";

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from "../utils/demo/chartsData";
import variables from "../common/globalVariables";

const Dashboard = () => {
  const [noOfStudents, setnoOfStudents] = useState("0");
  const { loggedInUser } = useContext(TeacherContext);

  const getAllAcceptedStudents = async () => {
    try {
      const token = sessionStorage.getItem("adminAccessToken");
      const students = await axios.get(
        `${variables.apiServer}/api/v1/students/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setnoOfStudents(students.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    console.log(loggedInUser);
    getAllAcceptedStudents();
  }, [loggedInUser]);

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total students" value={noOfStudents}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending balance" value="$ 46,760.89">
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Assignment Submissions" value="376">
          <RoundIcon
            icon={MenuIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending Enrollments" value={7}>
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>
    </>
  );
};

export default Dashboard;
