const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class SubmissionModel {
  tableName = "submissions";

  findTeacherAll = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN student on student.student_id = submissions.student_id ` +
      `INNER JOIN assignments ON assignments.assignment_id=${this.tableName}.assignment_id ` +
      `INNER JOIN courses ON courses.course_id=assignments.course_id ` +
      `WHERE courses.teacher_id=${params.teacher_id}`;
    return await query(sql);
  };

  findTeacherAllByAssignment = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN student on student.student_id = submissions.student_id ` +
      `INNER JOIN assignments ON assignments.assignment_id=${this.tableName}.assignment_id ` +
      `INNER JOIN courses ON courses.course_id=assignments.course_id ` +
      `WHERE courses.teacher_id=${params.teacher_id} ` +
      `AND ${this.tableName}.assignment_id=${params.assignment_id}`;
    return await query(sql);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;
    const result = await query(sql, [...values]);
    
    return result[0];
  };

  getSubmissionsByStudentId = async (params = {}) => {
    let sql = `SELECT S.*, C.course_name, A.title
    FROM ${this.tableName} S
    INNER JOIN assignments A
    ON A.assignment_id = S.assignment_id
    INNER JOIN enrollments EN
    ON A.course_id = EN.course_id
    INNER JOIN courses C
    ON C.course_id = EN.course_id
    WHERE EN.student_id = ${params.student_id}  AND EN.is_accepted = 1;`;
    return await query(sql);
  };

  //   findMy = async (params) => {
  //     let sql =
  //       `SELECT * FROM ${this.tableName} ` +
  //       `INNER JOIN courses ON courses.course_id=assignments.course_id ` +
  //       `INNER JOIN grade ON courses.grade_id=grade.grade_id ` +
  //       `WHERE courses.teacher_id="${params.teacher_id}"`;
  //     return await query(sql);
  //   };

  //   findSubmitted = async (params = {}) => {
  //     let sql =
  //       `SELECT * FROM ${this.tableName} ` +
  //       `INNER JOIN courses ON courses.course_id=assignments.course_id ` +
  //       `INNER JOIN grade ON courses.grade_id=grade.grade_id ` +
  //       `WHERE courses.teacher_id="${params.teacher_id}"`;
  //     return await query(sql);
  //   };

  create = async ({
    assignment_id,
    student_id,
    submission_url
  }) => {
    const sql = `INSERT INTO ${this.tableName}
        (assignment_id, student_id, submission_url) VALUES (?,?,?)`;

    const result = await query(sql, [
      assignment_id,
      student_id,
      submission_url
    ]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE submission_id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE submission_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new SubmissionModel();
