import { pool } from "../database";

export const getReceipts = async (req, res) => {
  const receiptFound = await pool.query(
    `SELECT * FROM v_receipts WHERE email_member = $1`,
    [req.memberEmail]
  );

  if (receiptFound.rows.length == 0)
    return res.status(404).json({ menssage: "You don't have receipt yet" });

  res.send(receiptFound.rows);
};

export const createReceipt = async (req, res) => {
  try {
    const memberEmail = req.memberEmail;
    const customerId = parseInt(req.params.customerId);

    /* 
    HERE ARE MISSING THESE FUNCTS:
    - FREE MEMBERSHIP: limit to 10 receipt
    - IF the member is creating duplicate receipt (payday = current payday from the same customer id = current id)
*/

    const customerFound = await pool.query(
      `SELECT id, name, lastname FROM v_customers WHERE email_member = $1 AND id = $2`,
      [memberEmail, customerId]
    );

    if (customerFound.rows.length == 0)
      return res
        .status(404)
        .json({ menssage: "You must have a customer for this." });

    const receiptFound = await pool.query(
      `SELECT id FROM v_receipts WHERE email_member = $1`,
      [req.memberEmail]
    );

    if (
      receiptFound.rows.length >= 10 &&
      req.memberMembershipType == "GRATIS"
    ) {
      return res.status(406).json({
        menssage: "You can only create 10 receipts with the FREE membership",
      });
    } else {

      // console.log(receiptFound.rows);
      receiptFound.rows.forEach(x => {if(x.id == 2) console.log(x)});
      
      // console.log(found);

      await pool.query(`CALL create_receipt($1, $1, $2)`, [
        memberEmail,
        customerId,
      ]);

      console.log("Llego hasta aqui");
      res.status(200).json({
        menssage:
          "You just created a receipt for " +
          customerFound.rows[0].name +
          " " +
          customerFound.rows[0].lastname,
      });
    }
  } catch (error) {
    res.send(error);
  }
};
