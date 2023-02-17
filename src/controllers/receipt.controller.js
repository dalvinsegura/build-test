import { pool } from "../database";
import boom from "@hapi/boom";

export const getReceipts = async (req, res, next) => {
  try {
    const receiptFound = await pool.query(
      `SELECT * FROM v_receipts WHERE email_member = $1`,
      [req.memberEmail]
    );

    if (receiptFound.rows.length == 0)
      throw boom.notFound("You don't have receipt yet");

    res.status(200).send(receiptFound.rows);
  } catch (error) {
    next(error);
  }
};

export const createReceipt = async (req, res, next) => {
  try {
    const memberEmail = req.memberEmail;
    const customerId = parseInt(req.body.customerId);
    const customerPaymentConcept = req.body.customerPaymentConcept;


    const customerFound = await pool.query(
      `SELECT id, name, lastname FROM v_customers WHERE email_member = $1 AND id = $2`,
      [memberEmail, customerId]
    );

    if (customerFound.rows.length == 0)
      throw boom.notFound("You must have a customer for creating a receipt");

    const receiptFound = await pool.query(
      `SELECT id FROM v_receipts WHERE email_member = $1`,
      [req.memberEmail]
    );

    if (
      receiptFound.rows.length >= 10 &&
      req.memberMembershipType == "GRATIS"
    ) {
      throw boom.conflict(
        "You can only create 10 receipts with the FREE membership"
      );
    } else {
      await pool.query(`CALL create_receipt($1, $1, $2, $3)`, [
        memberEmail,
        customerId,
        customerPaymentConcept,
      ]);

      res.status(200).json({
        message: `You just created a receipt for ${customerFound.rows[0].name} ${customerFound.rows[0].lastname}`,
      });
    }
  } catch (error) {
    next(error);
  }
};
