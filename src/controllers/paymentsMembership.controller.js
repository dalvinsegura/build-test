import { pool } from "../database";

export const getpaymentsMembershipForMembers = async (req, res) => {
  try {
    console.log(req.memberRole);
    console.log(req.memberEmail);
    if (req.memberRole == "ADMIN") {
      const response = await pool.query("SELECT * FROM v_payment_historial");
      res.send(response.rows);
    } else if (req.memberRole == "MEMBER") {
      const response = await pool.query(
        `SELECT * FROM v_payment_historial WHERE email_member = $1`,
        [req.memberEmail]
      );
      if (response.rows.length == 0)
        return res
          .status(404)
          .json({ menssage: "You don't have payments yet" });
      res.send(response.rows);
    } else {
      res.status(403).json({ menssage: "You don't have a valid role" });
    }
  } catch (error) {
    res.send(error);
  }
};

export const generatePremiumPayment = async (req, res) => {
  try {
    const { givePremiumTo, months } = req.body;

    let membershipType = await pool.query(
      `SELECT membership_type FROM v_member WHERE email = $1`,
      [givePremiumTo]
    );

    if (membershipType.rows.length !== 1)
      return res.status(404).json({
        menssage:
          "The user '" +
          givePremiumTo +
          "' you are trying to give premium doesn't exisit",
      });

    membershipType = membershipType.rows[0].membership_type;

    function addMonths(numOfMonths, date = new Date()) {
      date.setMonth(date.getMonth() + numOfMonths);
      return date;
    }

    if (membershipType == "PREMIUM")
      return res
        .status(406)
        .json({ menssage: "You already have a PREMIUM membership" });
    const response = await pool.query(
      `call create_premium_payment($1, $2, $3, $4)
        `,
      [req.memberEmail, givePremiumTo, months, addMonths(months)]
    );
    res.status(200).json({ menssage: `Payment made successfull` });
  } catch (error) {
    res.send(error);
  }
};

// export const generatePremiumPayment = async (req, res) => {};
// export const generatePremiumPayment = async (req, res) => {};
