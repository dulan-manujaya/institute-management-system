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
}

module.exports = new AttendanceModel();
