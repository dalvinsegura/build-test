import { pool } from "../database";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import IP from "ip";
import boom from "@hapi/boom";
import nodemailer from "nodemailer";

import * as dotenv from "dotenv";
dotenv.config();

const encryptPassword = async (password) => {
  const salt = await bycrypt.genSalt(10, password);

  return bycrypt.hash(password, salt);
};

const comparePassword = async (password, receivedPassword) => {
  return await bycrypt.compare(password, receivedPassword);
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const memberFound = await pool.query(
      `SELECT email FROM v_member WHERE email = $1`,
      [email]
    );

    // REPLACE TO EXPRESS VALIDATOR DEPENDECY
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

    const token = jwt.sign({ email: email }, process.env.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    // MAILING
    const mailingHandler = (mailConfirmationTo, name) => {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.HOST_MAIL,
          port: process.env.PORT_MAIL,
          secure: false,
          auth: {
            user: process.env.USER_MAIL,
            pass: process.env.PASS_MAIL,
          },
        });

        const mailOption = {
          from: "Instarecibo Team <servicio.instarecibo@outlook.com>",
          to: mailConfirmationTo,
          subject: "Confirmación de registro",
          text: `
     Hola, ${name}.\n\n\nGracias por formar parte de Instarecibo y interesarte en nuestra aplicación.\n\nEstos son tus datos de acceso:\n\nDirección de correo electrónico: ${mailConfirmationTo}\n\nUn saludo,\n\n El equipo de Instarecibo
     
     `,
        };

        transporter.sendMail(mailOption, (error, info) => {
          if (error) {
            throw boom.badRequest("Your email wasn't sent", error);
          } else {
            res.status(200).json({ message: "Email sent successfully!" });
          }
        });
      } catch (error) {
        next(error);
      }
    };

    // mailingHandler(email, name);

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = IP.address();

    // VERIFYING IF THE MEMBER EXISTS ON THE DATA BASE
    const memberFound = await pool.query(
      `SELECT * FROM v_member WHERE email= $1;`,
      [email]
    );

    if (memberFound.rows.length == 0) throw boom.notFound("Member not found");

    // COMPARING THE PASSWORD
    const matchPassword = await comparePassword(
      password,
      memberFound.rows[0].password
    );

    // IF IT'S TRUE RETURN MEMBER'S DATA
    if (!matchPassword) throw boom.unauthorized("Password is incorrect");

    const token = jwt.sign(
      { email: memberFound.rows[0].email },
      process.env.SECRET,
      {
        expiresIn: 86400,
      }
    );

    if (memberFound.rows[0].membership_status !== "ACTIVA")
      throw boom.unauthorized("Your membership is not active");

    await pool.query(
      `INSERT INTO login_historial (email_member, ip_address,log_date) VALUES ($1, $2, (SELECT CURRENT_TIMESTAMP))`,
      [memberFound.rows[0].email, ipAddress]
    );
    res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
};
