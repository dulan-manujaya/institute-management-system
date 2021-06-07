const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class PaymentModel {
  tableName = "payments";

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

    const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    return result[0];
  };

  createPayment = async ({ enrollment_id, paid_for_month, paid_for_year }) => {
    const sql = `INSERT INTO ${this.tableName}
        (enrollment_id, paid_for_month, paid_for_year) VALUES (?,?,?)`;

    const result = await query(sql, [
      enrollment_id,
      paid_for_month,
      paid_for_year,
    ]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  //   updatePayment = async (params, id) => {
  //     const { columnSet, values } = multipleColumnSet(params);

  //     const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE grade_id = ?`;

  //     const result = await query(sql, [...values, id]);

  //     return result;
  //   };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
        WHERE payment_id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  // Student

  getPaymentsByStudentId = async (params = {}) => {
    let sql = `SELECT P.*, C.course_name, C.amount 
    FROM ${this.tableName} P
    INNER JOIN enrollments EN
    ON P.enrollment_id = EN.enrollment_id
    INNER JOIN courses C
    ON EN.course_id = C.course_id
    WHERE EN.student_id = ${params.student_id};`;
    return await query(sql);
  };
}

module.exports = new PaymentModel();
