const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class EnrollmentModel {
  tableName = "enrollments";

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findMy = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN courses ON courses.course_id=enrollments.course_id ` +
      `WHERE student_id=${params.student_id}`;

    return await query(sql);
  };

  findStudents = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN courses ON courses.course_id=enrollments.course_id ` +
      `LEFT JOIN payments ON payments.enrollment_id=enrollments.enrollment_id ` +
      `INNER JOIN months ON months.month_id=payments.paid_for_month ` +
      `WHERE student_id=${params.student_id} ` +
      `AND is_accepted=true`;

    return await query(sql);
  };

  // byGrade = async (params = {}) => {
  //   let sql =
  //     `SELECT * FROM ${this.tableName} ` +
  //     `INNER JOIN courses ON courses.course_id=enrollments.course_id ` +
  //     `WHERE courses.course_id=${params.course_id} AND teacher_id=${params.teacher_id} ` +
  //     `AND is_accepted=true`;

  //   return await query(sql);
  // };

  byGradeWithStudents = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN courses ON courses.course_id=enrollments.course_id ` +
      `INNER JOIN student ON student.student_id=enrollments.student_id ` +
      `WHERE courses.course_id=${params.course_id} ` +
      `AND teacher_id=${params.teacher_id} ` +
      `AND is_accepted=true`;

    return await query(sql);
  };

  getEnrollmentDetails = async (params = {}) => {
    let sql =
      `Select count(E.enrollment_id) AS stu_count, C.course_id, C.course_name, E.is_accepted ` +
      `From courses C ` +
      `LEFT Join enrollments E ` +
      `On C.course_id = E.course_id ` +
      `Where teacher_id = ${params.teacher_id} ` +
      `Group By C.course_id, C.course_name, E.is_accepted`;

    return await query(sql);
  };

  findByAvailability = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN courses ON courses.course_id=enrollments.course_id ` +
      `INNER JOIN student ON student.student_id=enrollments.student_id ` +
      `INNER JOIN grade ON grade.grade_id=courses.grade_id ` +
      `WHERE courses.teacher_id=${params.teacher_id} ` +
      `AND enrollments.is_accepted=${params.is_accepted}`;

    return await query(sql);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    return result[0];
  };

  create = async ({ course_id, student_id }) => {
    var currDate = new Date();

    const sql = `INSERT INTO ${this.tableName}
        (course_id, student_id) VALUES (?,?)`;

    const result = await query(sql, [course_id, student_id]);

    const paymentsql = `INSERT INTO payments
    (enrollment_id, paid_for_month, paid_for_year) VALUES (?,?,?);`;

    query(paymentsql, [
      result.insertId,
      currDate.getMonth(),
      currDate.getFullYear(),
    ]);

    return result;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE enrollment_id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE enrollment_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new EnrollmentModel();
