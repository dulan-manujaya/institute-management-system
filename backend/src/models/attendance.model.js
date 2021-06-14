const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class AttendanceModel {
  tableName = "attendance";
  tableName2 = "teacher_attendance";

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

  create = async ({ student_id, course_id, att_date }) => {
    const sql = `INSERT INTO ${this.tableName}
        (student_id, course_id, att_date) VALUES (?,?,?)`;

    const result = await query(sql, [student_id, course_id, att_date]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  createTeacher = async ({ teacher_id, att_date }) => {
    const sql = `INSERT INTO ${this.tableName2}
        (teacher_id, att_date) VALUES (?,?)`;

    const result = await query(sql, [teacher_id, att_date]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE attendance_id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE attendance_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  getTeacherAttendanceByDates = async (params = {}) => {
    let sql = `SELECT A.*, CONCAT (T.first_name, ' ', T.last_name) as teacher_name
      FROM teacher_attendance A
      INNER JOIN teacher T
      ON T.teacher_id = A.teacher_id
      WHERE att_date BETWEEN '${params.from_date}' AND '${params.to_date}'`;
    console.log(sql);
    return await query(sql);
  };

  getStudentAttendanceByDates = async (params = {}) => {
    if (params.course_id == "All") {
      let sql = `SELECT A.*, C.course_name, CONCAT (S.first_name, ' ', S.last_name) as student_name
      FROM attendance A
      INNER JOIN courses C
      ON A.course_id = C.course_id
      INNER JOIN student S
      ON S.student_id = A.student_id
      WHERE att_date BETWEEN '${params.from_date}' AND '${params.to_date}'`;
      return await query(sql);
    } else {
      let sql = `SELECT A.*, C.course_name, CONCAT (S.first_name, ' ', S.last_name) as student_name
      FROM attendance A
      INNER JOIN courses C
      ON A.course_id = C.course_id
      INNER JOIN student S
      ON S.student_id = A.student_id
      WHERE A.course_id = ${params.course_id} AND att_date BETWEEN '${params.from_date}' AND '${params.to_date} '`;
      return await query(sql);
    }
  };
}

// Teacher

getStudentAttendanceByTeacherId = async (params = {}) => {
  if (params.course_id == "All") {
    let sql = `SELECT A.*, C.course_name, CONCAT (S.first_name, ' ', S.last_name) as student_name
      FROM attendance A
      INNER JOIN courses C
      ON A.course_id = C.course_id
      INNER JOIN student S
      ON S.student_id = A.student_id
      WHERE C.teacher_id = ${params.teacher_id} AND att_date BETWEEN '${params.from_date}' AND '${params.to_date}'`;
    return await query(sql);
  } else {
    let sql = `SELECT A.*, C.course_name, CONCAT (S.first_name, ' ', S.last_name) as student_name
      FROM attendance A
      INNER JOIN courses C
      ON A.course_id = C.course_id
      INNER JOIN student S
      ON S.student_id = A.student_id
      WHERE C.teacher_id = ${params.teacher_id} AND A.course_id = ${params.course_id} AND att_date BETWEEN '${params.from_date}' AND '${params.to_date} '`;
    return await query(sql);
  }
};

// Parent

getStudentAttendanceByParentId = async (params = {}) => {
  if (params.course_id == "All") {
    let sql = `SELECT A.*, C.course_name, CONCAT (S.first_name, ' ', S.last_name) as student_name
      FROM attendance A
      INNER JOIN courses C
      ON A.course_id = C.course_id
      INNER JOIN student S
      ON S.student_id = A.student_id
      WHERE S.guardian_id = ${params.guardian_id} AND att_date BETWEEN '${params.from_date}' AND '${params.to_date}'`;
    return await query(sql);
  } else {
    let sql = `SELECT A.*, C.course_name, CONCAT (S.first_name, ' ', S.last_name) as student_name
      FROM attendance A
      INNER JOIN courses C
      ON A.course_id = C.course_id
      INNER JOIN student S
      ON S.student_id = A.student_id
      WHERE S.guardian_id = ${params.guardian_id} AND A.course_id = ${params.course_id} AND att_date BETWEEN '${params.from_date}' AND '${params.to_date} '`;
    return await query(sql);
  }
};

module.exports = new AttendanceModel();
