const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class StudentModel {
  tableName = "student";
  guardianTableName = "guardian";

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
      `WHERE e.course_id=${params.course_id}`;
    console.log(sql);

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
    const sql = `SELECT S.*, G.guardian_email, G.guardian_mobile FROM ${this.tableName} S
    Inner Join ${this.guardianTableName} G
    On G.guardian_id = S.guardian_id
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
    email,
    password,
    first_name,
    last_name,
    avatar,
    mobile,
    date_of_birth,
    gender,
    guardian_email,
    guardian_mobile,
    guardian_password,
  }) => {
    const guardian_sql =
      `INSERT INTO ${this.guardianTableName} ` +
      `(guardian_email, guardian_password, guardian_mobile) VALUES (?,?,?) ` +
      `ON DUPLICATE KEY UPDATE ` +
      `guardian_email=?, guardian_mobile=?`;

    await query(guardian_sql, [
      guardian_email,
      guardian_password,
      guardian_mobile,
      guardian_email,
      guardian_mobile,
    ]);

    const guard_id_sql =
      `Select guardian_id from ${this.guardianTableName} ` +
      `WHERE guardian_email = '${guardian_email}'; `;

    const guardian_id = await query(guard_id_sql, []);

    const sql =
      `INSERT INTO ${this.tableName} ` +
      `(email, password, first_name, last_name, avatar, mobile, gender, date_of_birth, guardian_id) ` +
      `VALUES (?,?,?,?,?,?,?,?,?)`;

    const result = await query(sql, [
      email,
      password,
      first_name,
      last_name,
      avatar,
      mobile,
      gender,
      date_of_birth,
      guardian_id[0].guardian_id,
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

  //Teacher

  getStudentsByTeacherId = async (params = {}) => {
    let sql = `SELECT DISTINCT S.student_id, CONCAT (S.first_name, ' ', S.last_name) as student_name
    FROM ${this.tableName} S
    INNER JOIN enrollments E
    ON E.student_id = S.student_id
    INNER JOIN courses C
    ON E.course_id = C.course_id
    WHERE C.teacher_id = ${params.teacher_id} `;

    return await query(sql);
  };

  //Parent

  getStudentsByParentId = async (params = {}) => {
    let sql = `SELECT S.student_id, CONCAT (S.first_name, ' ', S.last_name) as student_name
    FROM ${this.tableName} S
    WHERE S.guardian_id = ${params.guardian_id} `;

    return await query(sql);
  };
}

module.exports = new StudentModel();
