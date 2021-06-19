import React, { useState, useEffect } from "react";
import axios from "axios";

import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import { ChatIcon, MenuIcon, MoneyIcon, PeopleIcon } from "../icons";
import RoundIcon from "../components/RoundIcon";
// import response from "../utils/demo/tableData";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from "@windmill/react-ui";

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from "../utils/demo/chartsData";

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [response, setResponse] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  // pagination setup
  const resultsPerPage = 10;
  // const totalResults = response.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    // getAllPendingStudents();
    // getAllAcceptedStudents();
  }, [page, response]);

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* <CTA /> */}

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Courses" value="50">
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

        <InfoCard title="Pending Assignments" value="2">
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <PageTitle>Upcoming Assignments</PageTitle>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Student</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Mobile</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={user.avatar}
                      alt="User image"
                    />
                    <div>
                      <p className="font-semibold">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.grade_name}</span>
                </TableCell>
                <TableCell>
                  <Badge type="success">{user.is_approved}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.mobile}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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

export default Dashboard;
