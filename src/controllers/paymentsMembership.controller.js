import { pool } from "../database";
import boom from "@hapi/boom";

export const getpaymentsMembershipForMembers = async (req, res, next) => {
  try {
    if (req.memberRole == "ADMIN") {
      const response = await pool.query("SELECT * FROM v_payment_historial");
      res.status(200).send(response.rows);
    } else if (req.memberRole == "MEMBER") {
      const response = await pool.query(
        `SELECT * FROM v_payment_historial WHERE email_member = $1`,
        [req.memberEmail]
      );
      if (response.rows.length == 0)
        throw boom.notFound("You don't have payments yet");
      res.status(200).send(response.rows);
    } else {
      throw boom.unauthorized("You don't have a valid role");
    }
  } catch (error) {
    next(error);
  }
};

export const generatePremiumPayment = async (req, res, next) => {
  try {
    const { givePremiumTo, months } = req.body;

    let membershipType = await pool.query(
      `SELECT membership_type FROM v_member WHERE email = $1`,
      [givePremiumTo]
    );

    if (membershipType.rows.length !== 1)
      throw boom.notFound(
        `The user '${givePremiumTo}' you are trying to give premium doesn't exisit`
      );

    membershipType = membershipType.rows[0].membership_type;

    function addMonths(numOfMonths, date = new Date()) {
      date.setMonth(date.getMonth() + numOfMonths);
      return date;
    }

    if (membershipType == "PREMIUM")
      throw boom.conflict("You already have a PREMIUM membership");

    await pool.query(`call create_premium_payment($1, $2, $3, $4)`, [
      req.memberEmail,
      givePremiumTo,
      months,
      addMonths(months),
    ]);
    res.status(200).json({ message: "Payment made successfull" });
  } catch (error) {
    next(error);
  }
};