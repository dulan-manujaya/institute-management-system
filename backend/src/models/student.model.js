const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class StudentModel {
  tableName = "student";

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findStudentByCourse = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} s ` +
      `INNER JOIN enrollments e ON e.student_id = s.student_id ` +
      `INNER JOIN courses c ON c.course_id = e.course_id ` +
      `WHERE e.is_accepted=1 ` +
      `AND e.course_id=${params.course_id}`;

    return await query(sql);
  };

  // findPending = async (params = {}) => {
  //   let sql = `SELECT grade.grade_name,student.* FROM ${this.tableName} INNER JOIN grade ON grade.grade_id=student.grade_id WHERE student.is_approved=false`;

  //   if (!Object.keys(params).length) {
  //     return await query(sql);
  //   }

  //   const { columnSet, values } = multipleColumnSet(params);
  //   sql += ` WHERE ${columnSet}`;

  //   return await query(sql, [...values]);
  // };

  findWithGrade = async (params = {}) => {
    let sql =
      `SELECT grade.grade_name,student.* FROM ${this.tableName} ` +
      `INNER JOIN grade ON grade.grade_id=student.grade_id`;

    return await query(sql);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    // return back the first row (student)
    return result[0];
  };

  findLast = async (params = {}) => {
    let sql = `SELECT student_id FROM student ORDER BY student_id DESC LIMIT 1`;

    const result = await query(sql);
    return result[0];
  };

  create = async ({
    student_auth_id,
    email,
    password,
    first_name,
    last_name,
    avatar,
    mobile,
    grade_id,
    date_of_birth,
    gender,
  }) => {
    const sql = `INSERT INTO ${this.tableName}
        (student_auth_id,email, password, first_name, last_name, avatar, mobile, grade_id, date_of_birth, gender) VALUES (?,?,?,?,?,?,?,?,?,?)`;

    const result = await query(sql, [
      student_auth_id,
      email,
      password,
      first_name,
      last_name,
      avatar,
      mobile,
      grade_id,
      date_of_birth,
      gender,
    ]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, id) => {
    try {
      const { columnSet, values } = multipleColumnSet(params);

      const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE student_id = ?`;

      const result = await query(sql, [...values, id]);

      return result;
    } catch (err) {
      console.log("error is:" + err);
    }
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE student_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new StudentModel();
