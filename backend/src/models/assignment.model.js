const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class AssignmentModel {
  tableName = "assignments";

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;
    const result = await query(sql, [...values]);

    return result[0];
  };

  findSubmitted = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN courses ON courses.course_id=assignments.course_id ` +
      `INNER JOIN grade ON courses.grade_id=grade.grade_id ` +
      `WHERE courses.teacher_id="${params.teacher_id}"`;
    return await query(sql);
  };

  findSubmittedByCourse = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN courses ON courses.course_id=assignments.course_id ` +
      `INNER JOIN grade ON courses.grade_id=grade.grade_id ` +
      `WHERE courses.teacher_id="${params.teacher_id}" ` +
      `AND courses.course_id="${params.course_id}"`;
    return await query(sql);
  };

  create = async ({ course_id, title, paper_url, deadline }) => {
    const sql = `INSERT INTO ${this.tableName}
        (course_id, title, paper_url, deadline) VALUES (?,?,?,?)`;

    const result = await query(sql, [course_id, title, paper_url, deadline]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE assignment_id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE assignment_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  // Student

  getAssignmentsByStudentId = async (params = {}) => {
    let sql = `SELECT A.*, C.course_name
    FROM ${this.tableName} A
    INNER JOIN enrollments EN
    ON A.course_id = EN.course_id
    INNER JOIN courses C
    ON C.course_id = EN.course_id
    LEFT JOIN submissions S
    ON S.assignment_id = A.assignment_id AND S.student_id = EN.student_id
    WHERE S.assignment_id IS NULL 
    AND EN.student_id = ${params.student_id}  AND EN.is_accepted = 1;`;
    return await query(sql);
  };
}

module.exports = new AssignmentModel();
