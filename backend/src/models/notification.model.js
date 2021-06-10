const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class AttendanceModel {
  tableName = "notifications";

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

  create = async ({ guardian_id, message }) => {
    const sql = `INSERT INTO ${this.tableName}
        (guardian_id, message) VALUES (?,?)`;

    const result = await query(sql, [guardian_id, message]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new AttendanceModel();
