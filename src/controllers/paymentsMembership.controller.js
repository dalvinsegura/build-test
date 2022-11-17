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

    let memberData = await pool.query(
      `SELECT membership_type, verified FROM v_member WHERE email = $1`,
      [givePremiumTo]
    );

    if (memberData.rows.length !== 1)
      throw boom.notFound(
        `The user '${givePremiumTo}' you are trying to give premium doesn't exisit`
      );

    const membershipType = memberData.rows[0].membership_type;
    const verified = memberData.rows[0].verified;

    if (verified === false)
      throw boom.badRequest("This memeber is unverified");

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

export const generateLifetimePayment = async (req, res, next) => {
  try {
    const { giveLifetimeTo } = req.body;

    let memberData = await pool.query(
      `SELECT membership_type, verified FROM v_member WHERE email = $1`,
      [giveLifetimeTo]
    );
    
    if (memberData.rows.length !== 1)
    throw boom.notFound(
      `The user '${giveLifetimeTo}' you are trying to give lifetime membership doesn't exisit`
      );
      
      const membershipType = memberData.rows[0].membership_type;
      const verified = memberData.rows[0].verified;

    if (verified === false)
      throw boom.badRequest("This memeber is unverified");

    if (membershipType == "LIFETIME")
      throw boom.conflict("You already have a LIFETIME membership");

    await pool.query(`call create_lifetime_payment($1, $2)`, [
      req.memberEmail,
      giveLifetimeTo
    ]);
    res.status(200).json({ message: "Payment made successfull" });
  } catch (error) {
    next(error);
  }
};