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

  findUploadedExams = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN courses ON courses.course_id=${this.tableName}.course_id ` +
      `INNER JOIN grade ON courses.grade_id=grade.grade_id ` +
      `WHERE courses.teacher_id="${params.teacher_id}"`;
    return await query(sql);
  };

  create = async ({
    course_id,
    exam_title,
    exam_date,
    exam_start_time,
    exam_end_time,
    exam_duration,
    paper_url,
  }) => {
    const sql = `INSERT INTO ${this.tableName}
        (course_id, exam_title, exam_date, exam_start_time, exam_end_time, exam_duration, paper_url) VALUES (?,?,?,?,?,?,?)`;

    const result = await query(sql, [
      course_id,
      exam_title,
      exam_date,
      exam_start_time,
      exam_end_time,
      exam_duration,
      paper_url,
    ]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE exam_id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE exam_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  // Student

  getExamsByStudentId = async (params = {}) => {
    let sql = `SELECT EX.*, C.course_name, DATE_ADD(EX.exam_date, INTERVAL EX.exam_duration MINUTE) exam_end_date
    FROM ${this.tableName} EX 
    INNER JOIN enrollments EN 
    ON EX.course_id = EN.course_id 
    INNER JOIN courses C 
    ON EX.course_id = C.course_id
    LEFT JOIN ${this.answerSubmissionTableName} EXAS
    ON EXAS.exam_id = EX.exam_id AND EXAS.student_id = EN.student_id
    WHERE EXAS.exam_id IS NULL 
    AND EN.student_id=${params.student_id} AND EN.is_accepted = 1 
    ORDER BY exam_date DESC`;
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
}

module.exports = new ExamModel();
