const PaymentModel = require("../models/payment.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Grade Controller
 ******************************************************************************/
class PaymentController {
  getAllPayments = async (req, res, next) => {
    let paymentList = await PaymentModel.find();
    if (!paymentList.length) {
      throw new HttpException(204, "Payments not found");
    } else {
      paymentList = paymentList.map((grade) => {
        const { password, ...paymentWithoutPassword } = grade;
        return paymentWithoutPassword;
      });

      res.send(paymentList);
    }
  };

  getPaymentById = async (req, res, next) => {
    const payment = await PaymentModel.findOne({
      payment_id: req.params.id,
    });
    if (!payment) {
      throw new HttpException(204, "Payment not found");
    }
    const { password, ...paymentWithoutPassword } = payment;
    res.send(paymentWithoutPassword);
  };

  createPayment = async (req, res, next) => {
    this.checkValidation(req);
    const result = await PaymentModel.createPayment(req.body);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Payment is made!");
  };

  //   updateGrade = async (req, res, next) => {
  //     this.checkValidation(req);

  //     await this.hashPassword(req);

  //     const { confirm_password, ...restOfUpdates } = req.body;

  //     const result = await PaymentModel.update(restOfUpdates, req.params.id);

  //     if (!result) {
  //       throw new HttpException(404, "Something went wrong");
  //     }

  //     const { affectedRows, changedRows, info } = result;

  //     const message = !affectedRows
  //       ? "Grade not found"
  //       : affectedRows && changedRows
  //       ? "Grade updated successfully"
  //       : "Updated failed";

  //     res.send({ message, info });
  //   };

  deletePayment = async (req, res, next) => {
    const result = await PaymentModel.delete(req.params.id);
    if (!result) {
      throw new HttpException(204, "Payment not found");
    }
    res.send("Payment has been removed");
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(400, "Validation failed", errors);
    }
  };

  // Student

  getByStudentId = async (req, res, next) => {
    let paymentsList = await PaymentModel.getPaymentsByStudentId({
      student_id: req.params.studentId,
    });
    if (!paymentsList.length) {
      throw new HttpException(204, "Payments not found");
    } else {
      paymentsList = paymentsList.map((payment) => {
        return payment;
      });

      res.send(paymentsList);
    }
  };
}

module.exports = new PaymentController();
