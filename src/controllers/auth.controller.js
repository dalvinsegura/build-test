import { pool } from "../database";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import IP from "ip";
import boom from "@hapi/boom";
import nodemailer from "nodemailer";
import CryptoJS from "crypto-js";

import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
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
      `SELECT email FROM v_member_auth WHERE email = $1`,
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

    await pool.query(`CALL new_otpcode($1, $1, $2)`, [email, "account verification"]);

    let OTPCode = await pool.query(`SELECT code FROM otp_code WHERE email_member = $1 AND reason = $2`, [email, 'account verification'])

    console.log(OTPCode.rows[0].code);

    OTPCode = OTPCode.rows[0].code


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
          
          Codigo de verificacion: ${OTPCode}

          

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

    // mailingHandler(email, name);

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
      `SELECT * FROM v_member_auth WHERE email= $1;`,
      [email]
    );

    console.log(memberFound);

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
        "UNVERIFIED EMAIL"
      );

    if (memberFound.rows[0].membership_status !== "ACTIVA")
      throw boom.unauthorized("Your membership is not active");

    // Checking membership expiration date
    const membership_type = memberFound.rows[0].membership_type;

    const m_started = new Date(memberFound.rows[0].membership_started)
      .toISOString()
      .split("T")[0];
    const m_finished = new Date(memberFound.rows[0].membership_finished)
      .toISOString()
      .split("T")[0];
    const currentDate = new Date().toISOString().split("T")[0];

    // CHECKING IF THE PREMIUM MEMBERS KEEP THEIR MEMBERSHIP ACTIVED
    if (membership_type == "PREMIUM")
      if (m_finished <= currentDate && memberFound.rows[0].role !== "ADMIN") {
        // CHECK IF THE MEMBERSHIP EXPIRED, IT WILL BE UPDATED TO GRATIS
        await pool.query(`CALL assign_free_membership($1, $1);`, [
          req.body.email,
        ]);
      }

    const accesstoken = jwt.sign(
      { email: memberFound.rows[0].email },
      process.env.SECRET,
      {
        expiresIn: "10d",
      }
    );

    const refreshToken = jwt.sign(
      { email: memberFound.rows[0].email },
      process.env.REFESH_TOKEN_SECRET,
      {
        expiresIn: "60d",
      }
    );

    // Saving refreshToken with current member
    await pool.query(`CALL update_refreshtoken($1, $2)`, [
      memberFound.rows[0].email,
      refreshToken,
    ]);

    await pool.query(
      `INSERT INTO login_historial (email_member, ip_address,log_date) VALUES ($1, $2, (SELECT CURRENT_TIMESTAMP))`,
      [memberFound.rows[0].email, ipAddress]
    );

    res.cookie("jwt", refreshToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ token: accesstoken, role: memberFound.rows[0].role });
  } catch (error) {
    next(error);
  }
};
