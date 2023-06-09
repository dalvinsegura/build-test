import { json, request } from "express";
import { pool } from "../database";
import boom from "@hapi/boom";

export const customerRegister = async (req, res, next) => {
  try {
    const {
      name,
      lastname,
      email_customer,
      address,
      sector,
      house_number,
      payday,
      paymentConcept,
    } = req.body;

    const memberFound = await pool.query(
      `SELECT membership_type FROM v_member m WHERE email = $1`,
      [req.memberEmail]
    );

    const customersFound = await pool.query(
      `SELECT id, name, lastname FROM v_customers WHERE email_member = $1`,
      [req.memberEmail]
    );

    if (
      memberFound.rows[0].membership_type == "GRATIS" &&
      customersFound.rows.length >= 3
    )
      throw boom.unauthorized(
        "You only can't add 3 customers with a FREE membership"
      );

    const duplicateCustomerFound = await pool.query(
      `SELECT count(id) FROM v_customers WHERE email_member = $1 AND name = $2 AND lastname = $3 AND payday = $4 AND house_number = $5`,
      [req.memberEmail, name, lastname, payday, house_number]
    );

    console.log(parseInt(duplicateCustomerFound.rows[0].count));
    if (parseInt(duplicateCustomerFound.rows[0].count) >= 1)
      throw boom.conflict("You already registered this customer");

    await pool.query(
      `CALL customer_register ($1, $1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        req.memberEmail,
        email_customer,
        name,
        lastname,
        address,
        sector,
        house_number,
        payday,
        paymentConcept,
      ]
    );

    res.sendStatus(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const customerFounded = await pool.query(
      `SELECT * FROM v_customers WHERE email_member = $1 OR (SELECT role FROM v_member WHERE email = $1) = 'ADMIN' OR (SELECT role FROM v_member WHERE email = $1) = 'INSPECTOR'`,
      [req.memberEmail]
    );

    if (customerFounded.rows.length == 0)
      return res.sendStatus(204);

    res.status(200).send(customerFounded.rows);
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customerFounded = await pool.query(
      `SELECT * FROM v_customers WHERE email_member = $1 AND id = $2`,
      [req.memberEmail, req.params.customerId]
    );

    if (customerFounded.rows.length == 0)
      throw boom.notFound("Customer not found");

    return res.status(200).send(customerFounded.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomerById = async (req, res, next) => {
  try {
    const memberFound = await pool.query(
      `SELECT membership_type FROM v_member WHERE email = $1`,
      [req.memberEmail]
    );

    console.log(req.memberRole);
    if (memberFound.rows[0].membership_type == "GRATIS")
      throw boom.unauthorized(
        "You can't delete customer with a FREE membership"
      );

    const customerFounded = await pool.query(
      `SELECT id FROM v_customers WHERE email_member = $1 AND id = $2`,
      [req.memberEmail, req.params.customerId]
    );

    console.log(customerFounded.rows.length)
    console.log(customerFounded.rows)

    if (customerFounded.rows.length == 0 && req.memberRole !== "ADMIN")
      throw boom.notFound("Customer not found");

    await pool.query(`CALL customer_remover($1, $1, $2)`, [
      req.memberEmail,
      req.params.customerId,
    ]);
    console.log("Test 1");
    res.status(200).json({ message: "Customer Deleteted Successfully" });
    console.log("Test 2");
  } catch (error) {
    next(error);
  }
};

