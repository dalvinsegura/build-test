import { json, request } from "express";
import { pool } from "../database";

export const customerRegister = async (req, res) => {
  const { name, lastname, address, sector, payday, paymentConcept } = req.body;

  const memberFound = await pool.query(
    `SELECT membership_type FROM v_member m WHERE email = $1`,
    [req.memberEmail]
  );

  const customersFound = await pool.query(
    `SELECT id FROM v_customers WHERE email_member = $1`,
    [req.memberEmail]
  );

  if (
    memberFound.rows[0].membership_type == "GRATIS" &&
    customersFound.rows.length >= 3
  )
    return res
      .status(403)
      .json({
        menssage: "You only can't add 3 customers with a FREE membership",
      });

  const response = await pool.query(
    `CALL customer_register ($1, $1, $2, $3, $4, $5, $6, $7)`,
    [req.memberEmail, name, lastname, address, sector, payday, paymentConcept]
  );

  console.log(response);

  res.status(200).json({ message: "Customer registered successfully" });
};

export const getCustomer = async (req, res) => {
  try {
    const customerFounded = await pool.query(
      `SELECT * FROM v_customers WHERE email_member = $1 OR (SELECT role FROM v_member WHERE email = $1) = 'ADMIN' OR (SELECT role FROM v_member WHERE email = $1) = 'INSPECTOR'`,
      [req.memberEmail]
    );

    if (customerFounded.rows.length == 0)
      return res.status(404).json({ error: "You don't have customers yet" });

    res.send(customerFounded.rows);
  } catch (error) {
    res.json({ error: error });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customerFounded = await pool.query(
      `SELECT * FROM v_customers WHERE email_member = $1 AND id = $2`,
      [req.memberEmail, req.params.customerId]
    );

    if (customerFounded.rows.length == 0)
      return res.status(404).json({ message: "Customer not found" });

    return res.send(customerFounded.rows[0]);
  } catch (error) {
    return res.send(error);
  }
};

export const deleteCustomerById = async (req, res) => {
  try {
    const memberFound = await pool.query(
      `SELECT membership_type FROM v_member WHERE email = $1`,
      [req.memberEmail]
    );
    console.log(memberFound.rows[0].membership_type);
    if (memberFound.rows[0].membership_type == "GRATIS")
      return res
        .status(403)
        .json({ menssage: "You can't delete customer with a FREE membership" });

    const customerFounded = await pool.query(
      `SELECT id FROM v_customers WHERE email_member = $1 AND id = $2`,
      [req.memberEmail, req.params.customerId]
    );

    if (customerFounded.rows.length == 0)
      return res.status(404).json({ message: "Customer not found" });

    await pool.query(
      `CALL customer_remover('${req.memberEmail}', '${req.memberEmail}', '${req.params.customerId}')`
    );
    res.json("Customer Deleteted Successfully");
  } catch (error) {
    res.send(error);
  }
};
