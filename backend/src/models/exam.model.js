const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class ExamModel {
  tableName = "exams";
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

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;
    const result = await query(sql, [...values]);

    return result[0];
  };

  findSubmittedByCourse = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN courses ON courses.course_id=${this.tableName}.course_id ` +
      `WHERE courses.course_id="${params.course_id}"`;
    return await query(sql);
  };

  create = async ({ course_id, exam_name }) => {
    const sql = `INSERT INTO ${this.tableName}
        (course_id, exam_name) VALUES (?,?)`;

    const result = await query(sql, [course_id, exam_name]);
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

  getExamsByStudentId = async (params = {}) => {
    let sql = `SELECT DISTINCT E.exam_name, E.exam_id
      FROM results R 
      INNER JOIN exams E
      ON E.exam_id = R.exam_id
      INNER JOIN courses C
      ON E.course_id = C.course_id
      WHERE R.student_id = ${params.student_id}`;
    return await query(sql);
  };

  getExamAnswerSubmissonsByStudentId = async (params = {}) => {
    let sql = `SELECT EX.*, C.course_name, DATE_ADD(EX.exam_date, INTERVAL EX.exam_duration MINUTE) exam_end_date, EXAS.answer_sheet_url
    FROM ${this.answerSubmissionTableName} EXAS
    INNER JOIN  ${this.tableName} EX 
    ON EXAS.exam_id = EX.exam_id
    INNER JOIN enrollments EN 
    ON EX.course_id = EN.course_id 
    INNER JOIN courses C 
    ON EX.course_id = C.course_id
    WHERE EN.student_id=${params.student_id} AND EN.is_accepted = 1 
    ORDER BY exam_date DESC`;
    return await query(sql);
  };

  createExamAnswerSubmission = async ({
    exam_id,
    student_id,
    answer_sheet_url,
  }) => {
    const sql = `INSERT INTO ${this.answerSubmissionTableName}
        (exam_id, student_id, answer_sheet_url) VALUES (?,?,?)`;
    const result = await query(sql, [exam_id, student_id, answer_sheet_url]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };

  // Parent

  getExamsByParentId = async (params = {}) => {
    let sql = `SELECT DISTINCT E.exam_name, E.exam_id 
        FROM results R 
        INNER JOIN exams E
        ON E.exam_id = R.exam_id
        INNER JOIN courses C
        ON E.course_id = C.course_id
        INNER JOIN student S
        ON S.student_id = R.student_id
        WHERE S.guardian_id = ${params.guardian_id} `;
    return await query(sql);
  };

  // Teacher

  getExamsByTeacherId = async (params = {}) => {
    let sql = `SELECT DISTINCT E.exam_name, E.exam_id
        FROM results R 
        INNER JOIN exams E
        ON E.exam_id = R.exam_id
        INNER JOIN courses C
        ON E.course_id = C.course_id
        INNER JOIN student S
        ON S.student_id = R.student_id
        WHERE C.teacher_id = ${params.teacher_id} `;
    return await query(sql);
  };
}

module.exports = new ExamModel();
