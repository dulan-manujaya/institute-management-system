const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class CourseModel {
  tableName = "courses";

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findMyByGrade = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `WHERE teacher_id = ${params.teacher_id} ` +
      `AND grade_id = ${params.grade_id}`;

    return await query(sql);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;
    const result = await query(sql, [...values]);

    return result[0];
  };

  create = async ({ teacher_id, amount, course_name }) => {
    const sql = `INSERT INTO ${this.tableName}
        (teacher_id, amount, course_name) VALUES (?,?,?)`;

    const result = await query(sql, [teacher_id, amount, course_name]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE course_id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE course_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  // Student

  getCoursesByStudentId = async (params = {}) => {
    let sql = `SELECT C.*, CONCAT(T.first_name, ' ' ,T.last_name) teacher_name, C.description
    FROM ${this.tableName} C
    INNER JOIN teacher T
    ON T.teacher_id = C.teacher_id
    LEFT JOIN enrollments EN
    ON C.course_id = EN.course_id AND EN.student_id = ${params.student_id}
    WHERE EN.enrollment_id IS NULL;`;

    return await query(sql);
  };

  // Teacher
  getCoursesByTeacherId = async (params = {}) => {
    let sql = `SELECT *
    FROM ${this.tableName}    
    WHERE teacher_id = ${params.teacher_id};`;

    return await query(sql);
  };

  // Parent

  getCoursesByParentId = async (params = {}) => {
    let sql = `SELECT DISTINCT C.* 
    FROM ${this.tableName} C
    INNER JOIN enrollments E
    ON E.course_id = C.course_id
    INNER JOIN student S
    ON S.student_id = E.student_id
    WHERE S.guardian_id = ${params.guardian_id};`;

    return await query(sql);
  };
}

module.exports = new CourseModel();
