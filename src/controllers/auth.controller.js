import { pool } from "../database";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import IP from "ip";

import config from "../config";

const encryptPassword = async (password) => {
  const salt = await bycrypt.genSalt(10, password);

  return bycrypt.hash(password, salt);
};

const comparePassword = async (password, receivedPassword) => {
  return await bycrypt.compare(password, receivedPassword);
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  const memberFound = await pool.query(
    `SELECT email FROM v_member WHERE email = $1`,
    [email]
  );

  if (memberFound.rows.length !== 0)
    return res.status(400).json({ menssage: "You already have an account" });

  if (email == null)
    return res.status(400).json({ menssage: "Email Undefinded" });

  if (password == null)
    return res.status(400).json({ menssage: "Password Undefinded" });

  if (name == null)
    return res.status(400).json({ menssage: "Name Undefinded" });

  const response = await pool.query(
    `CALL signup_member('${email}', '${await encryptPassword(
      password
    )}', '${name}')`
  );

  await console.log(response);

  const token = jwt.sign({ email: email }, config.SECRET, {
    expiresIn: 86400, // 24 hours
  });

  res.json({ token });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = IP.address();

  // VERIFYING IF THE MEMBER EXISTS ON THE DATA BASE
  const memberFound = await pool.query(
    `SELECT * FROM v_member WHERE email= $1;`,
    [email]
  );

  if (memberFound.rows.length == 0)
    return res.status(400).json({ message: "Member not found" });

  // COMPARING THE PASSWORD
  const matchPassword = await comparePassword(
    password,
    memberFound.rows[0].password
  );

  // IF IT'S TRUE RETURN MEMBER'S DATA
  if (!matchPassword)
    return res
      .status(401)
      .json({ token: null, message: "Password is incorrect" });

  const token = jwt.sign({ email: memberFound.rows[0].email }, config.SECRET, {
    expiresIn: 86400,
  });

  if (memberFound.rows[0].membership_status !== "ACTIVA")
    return res.status(403).json({ message: "Your membership is not active" });

  await pool.query(
    `INSERT INTO login_historial (email_member, ip_address,log_date) VALUES ($1, $2, NOW())`,
    [memberFound.rows[0].email, ipAddress]
  );

  res.status(200).json({ token: token });
};
