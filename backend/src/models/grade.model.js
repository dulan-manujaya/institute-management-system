const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class GradeModel {
  tableName = "grade";

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

  create = async ({ grade_name }) => {
    const sql = `INSERT INTO ${this.tableName}
        (grade_name) VALUES (?)`;

    const result = await query(sql, [grade_name]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE grade_id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE grade_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new GradeModel();
