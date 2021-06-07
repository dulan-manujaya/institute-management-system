import React, { lazy, useState, useMemo, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import axios from "axios";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import { TeacherContext, GradeContext } from "./context/Context.Index";
import variables from "./common/globalVariables";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [grades, setGrades] = useState("");
  const providerValue = useMemo(
    () => ({ loggedInUser, setLoggedInUser }),
    [loggedInUser, setLoggedInUser]
  );

  const getGrades = async () => {
    try {
      const grade = await axios.get(`${variables.apiServer}/api/v1/grades`);
      setGrades(grade.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTeacherId = async () => {
    try {
      const token = sessionStorage.getItem("adminAccessToken");
      if (token) {
        const currTeacher = await axios.get(
          `${variables.apiServer}/api/v1/admins/whoami`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (currTeacher) {
          console.log(currTeacher);
          const loggedUser = {
            email: currTeacher.data.email,
            first_name: currTeacher.data.first_name,
            last_name: currTeacher.data.last_name,
            mobile: currTeacher.data.mobile,
            admin_id: currTeacher.data.admin_id,
            token: sessionStorage.getItem("adminAccessToken"),
          };
          setLoggedInUser(loggedUser);
        }
      }
    } catch (err) {
      console.log(err);
      // window.location.replace("/login");
    }
  };

  useEffect(() => {
    getTeacherId();
    localStorage.setItem("theme", "dark");
  }, []);
  return (
    <>
      <Router>
        <TeacherContext.Provider value={providerValue}>
          <GradeContext.Provider value={{ grades, setGrades }}>
            <AccessibleNavigationAnnouncer />
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/create-account" component={CreateAccount} />
              <Route path="/forgot-password" component={ForgotPassword} />

              {/* Place new routes over this */}
              <Route path="/app" component={Layout} />
              {/* If you have an index page, you can remothis Redirect */}
              <Redirect exact from="/" to="/login" />
            </Switch>
          </GradeContext.Provider>
        </TeacherContext.Provider>
      </Router>
    </>
  );
};

export default App;
