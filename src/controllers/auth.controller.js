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
    const { email, password, name, lastname } = req.body;

    const memberFound = await pool.query(
      `SELECT email FROM v_member WHERE email = $1`,
      [email]
    );

    if (memberFound.rows.length !== 0)
      return res
        .status(400)
        .json({ menssage: "You already have an account with this email" });

    await pool.query(`CALL signup_member($1, $2, $3, $4)`, [
      email,
      await encryptPassword(password),
      name,
      lastname,
    ]);

    const emailToken = jwt.sign({ email: email }, process.env.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    // MAILING
    const mailingHandler = (mailConfirmationTo, name) => {
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
        subject: "Confirma tu correo electronico",
        text: `
          Hola ${name},\n
          Gracias por unirse a Instarecibo.\n\n
          
          Nos gustaría confirmar que su cuenta se creó correctamente. Para acceder al [portal del cliente], haga clic en el siguiente enlace.\n\n
          
          http://localhost:3000/account/email_verification/${emailToken}\n\n
          
          Si tiene algún problema para iniciar sesión en su cuenta, comuníquese con nosotros a sorporte.instarecibo@outlook.com\n\n
          
          Saludos,\n
          El equipo de Instarecibo\n
     `,
      };

      transporter.sendMail(mailOption, (error, info) => {
        throw (req, res, next) => {
          try {
            if (error) {
              return boom.badRequest("Your email wasn't sent", error);
            } else {
              res.status(200).json({ message: "Email sent successfully!" });
            }
          } catch (error) {
            next(error);
          }
        };
      });
    };

    mailingHandler(email, name);

    // res.json({ token });
    res.status(200).send("You were signed up!");
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

    if (!memberFound.rows[0].verified)
      throw boom.forbidden(
        "Verify your email address, to continue using Instarecibo"
      );

    if (memberFound.rows[0].membership_status !== "ACTIVA")
      throw boom.unauthorized("Your membership is not active");

    const token = jwt.sign(
      { email: memberFound.rows[0].email },
      process.env.SECRET,
      {
        expiresIn: 86400,
      }
    );

    await pool.query(
      `INSERT INTO login_historial (email_member, ip_address,log_date) VALUES ($1, $2, (SELECT CURRENT_TIMESTAMP))`,
      [memberFound.rows[0].email, ipAddress]
    );
    res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
};
