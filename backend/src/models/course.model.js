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

  create = async ({
    grade_id,
    teacher_id,
    amount,
    course_name,
    subject_id,
  }) => {
    const sql = `INSERT INTO ${this.tableName}
        (grade_id, teacher_id, amount, course_name, subject_id) VALUES (?,?,?,?,?)`;

    const result = await query(sql, [
      grade_id,
      teacher_id,
      amount,
      course_name,
      subject_id,
    ]);
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
    let sql = `SELECT C.*, EN.enrolled_date
    FROM ${this.tableName} C
    INNER JOIN enrollments EN
    ON C.course_id = EN.course_id
    WHERE EN.student_id = ${params.student_id} AND EN.is_accepted = 1;`;

    return await query(sql);
  };
}

module.exports = new CourseModel();