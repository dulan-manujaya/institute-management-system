const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class CourseMaterialModel {
  tableName = "course_material";

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

  findSubmitted = async (params = {}) => {
    let sql =
      `SELECT * FROM ${this.tableName} ` +
      `INNER JOIN courses ON courses.course_id=course_material.course_id ` +
      `INNER JOIN grade ON courses.grade_id=grade.grade_id ` +
      `WHERE courses.teacher_id="${params.teacher_id}"`;
    return await query(sql);
  };

  create = async ({
    course_id,
    cm_name,
    cm_file_url,
    cm_availability,
    cm_submitted_date,
  }) => {
    const sql = `INSERT INTO ${this.tableName}
        (course_id, cm_name, cm_file_url, cm_availability, cm_submitted_date) VALUES (?,?,?,?,?)`;

    const result = await query(sql, [
      course_id,
      cm_name,
      cm_file_url,
      cm_availability,
      cm_submitted_date,
    ]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE cm_id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE cm_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new CourseMaterialModel();
