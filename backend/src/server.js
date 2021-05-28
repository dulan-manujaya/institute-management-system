const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs-extra");
const HttpException = require("./utils/HttpException.utils");
const errorMiddleware = require("./middleware/error.middleware");
const teacherRouter = require("./routes/teacher.route");
const studentRouter = require("./routes/student.route");
const forgotPasswordRouter = require("./routes/forgot_password.route");
const courseRouter = require("./routes/course.route");
const assignmentRouter = require("./routes/assignment.route");
const submissionRouter = require("./routes/submission.route");
const enrollmentRouter = require("./routes/enrollment.route");
const gradeRouter = require("./routes/grade.route");
const subjectRouter = require("./routes/subject.route");
const paymentRouter = require("./routes/payment.route");
const courseMaterialRouter = require("./routes/courseMaterial.route");
const examRouter = require("./routes/exam.route");

// Init express
const app = express();
// Init environment
dotenv.config();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let type = req.params.type;
      let path = `src/public/${type}`;
      fs.mkdirsSync(path);
      callback(null, path);
    },
    filename: (req, file, callback) => {
      fileName = file.originalname;
      //originalname is the uploaded file's name with extn
      callback(null, fileName);
    },
  }),
});

app.use(
  cors({
    origin: [process.env.WEBURL1, process.env.WEBURL2],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public"));
app.use("/public", express.static(path.join(__dirname, "/public")));

const port = Number(process.env.PORT || 4000);

app.use(`/api/v1/teachers`, teacherRouter);
app.use(`/api/v1/students`, studentRouter);
app.use(`/api/v1/forgot-password`, forgotPasswordRouter);
app.use(`/api/v1/courses`, courseRouter);
app.use(`/api/v1/assignments`, assignmentRouter);
app.use(`/api/v1/submissions`, submissionRouter);
app.use(`/api/v1/enrollments`, enrollmentRouter);
app.use(`/api/v1/grades`, gradeRouter);
app.use(`/api/v1/subjects`, subjectRouter);
app.use(`/api/v1/payments`, paymentRouter);
app.use(`/api/v1/coursematerials`, courseMaterialRouter);
app.use(`/api/v1/exams`, examRouter);

app.post("/api/v1/uploads/:type", upload.single("file"), (req, res) => {
  res.status(200).send("File Uploaded Successfully");
});

// 404 error
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () => {
  var dir = "/public";

  // if (!fs.existsSync(dir)) {
  //   fs.mkdirSync(dir);
  // }

  console.log(`🚀 Server running on port ${port}!`);
});

module.exports = app;
