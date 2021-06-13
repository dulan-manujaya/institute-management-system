const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class ExamModel {
  tableName = "results";
  answerSubmissionTableName = "exam_answer_submissions";

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findAll = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      ` INNER JOIN exams E ON E.exam_id = ${this.tableName}.exam_id ` +
      ` INNER JOIN courses C ON E.course_id = C.course_id ` +
      ` INNER JOIN student S ON S.student_id = ${this.tableName}.student_id`;

    return await query(sql);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;
    const result = await query(sql, [...values]);

    return result[0];
  };

  findByExam = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN courses ON courses.course_id=${this.tableName}.course_id ` +
      `WHERE courses.course_id="${params.course_id}"`;
    return await query(sql);
  };

  create = async ({ student_id, exam_id, marks }) => {
    const sql = `INSERT INTO ${this.tableName}
        (student_id, exam_id, marks) VALUES (?,?,?)`;

    const result = await query(sql, [student_id, exam_id, marks]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  // update = async (params, id) => {
  //   const { columnSet, values } = multipleColumnSet(params);

  //   const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE exam_id = ?`;

  //   const result = await query(sql, [...values, id]);

  //   return result;
  // };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE exam_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  // Student

  getResultsByStudentId = async (params = {}) => {
    if (params.course_id == "All") {
      let sql = `SELECT C.course_name, C.course_id, E.exam_name, R.marks 
      FROM results R 
      INNER JOIN exams E
      ON E.exam_id = R.exam_id
      INNER JOIN courses C
      ON E.course_id = C.course_id
      WHERE R.student_id = ${params.student_id}`;
      return await query(sql);
    } else {
      let sql = `SELECT C.course_name, C.course_id, E.exam_name, R.marks 
      FROM results R 
      INNER JOIN exams E
      ON E.exam_id = R.exam_id
      INNER JOIN courses C
      ON E.course_id = C.course_id
      WHERE R.student_id = ${params.student_id} AND E.course_id = ${params.course_id}`;
      return await query(sql);
    }
  };

  // Teacher

  getResultsByTeacherId = async (params = {}) => {
    if (params.course_id == "All") {
      if (params.student_id == "All") {
        let sql = `SELECT C.course_name, C.course_id, E.exam_name, CONCAT (S.first_name, ' ', S.last_name) as student_name, S.student_id, R.marks 
        FROM results R 
        INNER JOIN exams E
        ON E.exam_id = R.exam_id
        INNER JOIN courses C
        ON E.course_id = C.course_id
        INNER JOIN student S
        ON S.student_id = R.student_id
        WHERE C.teacher_id = ${params.teacher_id} `;
        return await query(sql);
      } else {
        let sql = `SELECT C.course_name, C.course_id, E.exam_name, CONCAT (S.first_name, ' ', S.last_name) as student_name, S.student_id, R.marks 
        FROM results R 
        INNER JOIN exams E
        ON E.exam_id = R.exam_id
        INNER JOIN courses C
        ON E.course_id = C.course_id
        INNER JOIN student S
        ON S.student_id = R.student_id
        WHERE C.teacher_id = ${params.teacher_id} AND R.student_id = ${params.student_id}`;
        return await query(sql);
      }
    } else {
      if (params.student_id == "All") {
        let sql = `SELECT C.course_name, C.course_id, E.exam_name, CONCAT (S.first_name, ' ', S.last_name) as student_name, S.student_id, R.marks 
        FROM results R 
        INNER JOIN exams E
        ON E.exam_id = R.exam_id
        INNER JOIN courses C
        ON E.course_id = C.course_id
        INNER JOIN student S
        ON S.student_id = R.student_id
        WHERE C.teacher_id = ${params.teacher_id} AND E.course_id = ${params.course_id}`;
        return await query(sql);
      } else {
        let sql = `SELECT C.course_name, C.course_id, E.exam_name, CONCAT (S.first_name, ' ', S.last_name) as student_name, S.student_id, R.marks 
        FROM results R 
        INNER JOIN exams E
        ON E.exam_id = R.exam_id
        INNER JOIN courses C
        ON E.course_id = C.course_id
        INNER JOIN student S
        ON S.student_id = R.student_id
        WHERE C.teacher_id = ${params.teacher_id}  AND R.student_id = ${params.student_id} AND E.course_id = ${params.course_id}`;
        return await query(sql);
      }
    }
  };

  // Parent

  getResultsByParentId = async (params = {}) => {
    if (params.course_id == "All") {
      if (params.student_id == "All") {
        let sql = `SELECT C.course_name, C.course_id, E.exam_name, CONCAT (S.first_name, ' ', S.last_name) as student_name, S.student_id, R.marks 
        FROM results R 
        INNER JOIN exams E
        ON E.exam_id = R.exam_id
        INNER JOIN courses C
        ON E.course_id = C.course_id
        INNER JOIN student S
        ON S.student_id = R.student_id
        WHERE S.guardian_id = ${params.guardian_id} `;
        return await query(sql);
      } else {
        let sql = `SELECT C.course_name, C.course_id, E.exam_name, CONCAT (S.first_name, ' ', S.last_name) as student_name, S.student_id, R.marks 
        FROM results R 
        INNER JOIN exams E
        ON E.exam_id = R.exam_id
        INNER JOIN courses C
        ON E.course_id = C.course_id
        INNER JOIN student S
        ON S.student_id = R.student_id
        WHERE S.guardian_id = ${params.guardian_id} AND R.student_id = ${params.student_id} `;
        return await query(sql);
      }
    } else {
      if (params.student_id == "All") {
        let sql = `SELECT C.course_name, C.course_id, E.exam_name, CONCAT (S.first_name, ' ', S.last_name) as student_name, S.student_id, R.marks 
        FROM results R 
        INNER JOIN exams E
        ON E.exam_id = R.exam_id
        INNER JOIN courses C
        ON E.course_id = C.course_id
        INNER JOIN student S
        ON S.student_id = R.student_id
        WHERE S.guardian_id = ${params.guardian_id} AND E.course_id = ${params.course_id} `;
        return await query(sql);
      } else {
        let sql = `SELECT C.course_name, C.course_id, E.exam_name, CONCAT (S.first_name, ' ', S.last_name) as student_name, S.student_id, R.marks 
        FROM results R 
        INNER JOIN exams E
        ON E.exam_id = R.exam_id
        INNER JOIN courses C
        ON E.course_id = C.course_id
        INNER JOIN student S
        ON S.student_id = R.student_id
        WHERE S.guardian_id = ${params.guardian_id} AND R.student_id = ${params.student_id} AND E.course_id = ${params.course_id}`;
        return await query(sql);
      }
    }
  };
}

module.exports = new ExamModel();
