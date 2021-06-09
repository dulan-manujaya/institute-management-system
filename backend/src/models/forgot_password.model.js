const query = require("../db/db-connection");
const { multipleColumnSet } = require("../utils/common.utils");
class ForgotPasswordModel {
  studentTable = "student";
  teacherTable = "teacher";
  guardianTable = "guardian";
  otpTable = "forgot_password_otp";

  verifyStudentEmail = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.studentTable}
        WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    // return back the first row (student)
    return result[0];
  };

  verifyTeacherEmail = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);
    const sql = `SELECT * FROM ${this.teacherTable}
        WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    // return back the first row (teacher)
    return result[0];
  };

  verifyParentEmail = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);
    const sql = `SELECT * FROM ${this.guardianTable}
        WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    // return back the first row (parent)
    return result[0];
  };

  insertOTP = async (email) => {
    var charArr = [];
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
      charArr.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    var otp = charArr.join("");

    var sql = `DELETE FROM ${this.otpTable} WHERE email = '${email}';`;
    await query(sql);
    sql = `INSERT INTO ${this.otpTable}
    (email, otp_code) VALUES (?, ?);`;

    const result = await query(sql, [email, otp]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };

  verifyOTP = async (params) => {
    const sql = `SELECT EXISTS(SELECT * FROM ${this.otpTable}
        WHERE email = '${params.email}' AND otp_code = '${params.otp}') AS isValid`;

    const result = await query(sql);
    const { isValid } = result[0];

    if (isValid == 1) {
      const sql = `DELETE FROM ${this.otpTable} WHERE email = '${params.email}';`;
      await query(sql);
    }

    return isValid;
  };

  resetPassword = async (params) => {
    if (params.type == "student") {
      const sql = `UPDATE ${this.studentTable}
      SET
      password = '${params.password}'
      WHERE email = '${params.email}';`;
      const result = await query(sql);
      const affectedRows = result ? result.affectedRows : 0;
      return affectedRows;
    }
    if (params.type == "teacher") {
      const sql = `UPDATE ${this.teacherTable}
      SET
      password = '${params.password}'
      WHERE email = '${params.email}';`;
      const result = await query(sql);
      const affectedRows = result ? result.affectedRows : 0;
      return affectedRows;
    }
    if (params.type == "parent") {
      const sql = `UPDATE ${this.guardianTable}
      SET
      guardian_password = '${params.password}'
      WHERE guardian_email = '${params.email}';`;
      const result = await query(sql);
      const affectedRows = result ? result.affectedRows : 0;
      return affectedRows;
    }
  };
}

module.exports = new ForgotPasswordModel();
