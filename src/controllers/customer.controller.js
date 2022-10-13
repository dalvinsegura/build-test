import { json, request } from "express";
import { pool } from "../database";

export const customerRegister = async (req, res) => {
  const { name, lastname, address, sector, payday, paymentConcept } = req.body;

  const memberFound = await pool.query(
    `SELECT email FROM member WHERE email = $1`,
    [req.memberEmail]
  );

  if (memberFound.rows.length == 0)
    return res.status(404).json({ messages: "Member does not exist" });

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

export const getCustomerById = async (req, res) => {};

export const deleteCustomerById = async (req, res) => {
  const customerFounded = await pool.query(
    `SELECT id FROM customer WHERE email_member = $1 AND id = $2`,
    [req.memberEmail, req.params.customerId]
  );

  if (customerFounded.rows.length == 0)
    return res.status(404).json({ message: "Customer not found" });

  await pool.query(
    `CALL customer_remover('${req.memberEmail}', '${req.memberEmail}', '${req.params.customerId}')`
  );
  res.json("Customer Deleteted Successfully");
};
