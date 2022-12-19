import { pool } from "../database";
import boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import * as dotenv from "dotenv";
import { response } from "express";
dotenv.config();

export const verifyEmailByEmail = async (req, res, next) => {
  const emailToVerify = req.body.emailToVerify;
  const otpCodeInput = parseInt(req.body.otpCodeInput);

  try {
    const otpResponse = await pool.query(
      `SELECT * FROM otp_code WHERE email_member = $1 AND reason = $2`,
      [emailToVerify, "account verification"]
    );

    if (otpResponse.rows == 0)
      throw boom.forbidden(
        "There was an error with your verification. Contact to support department."
      );

    const otpCodeGenerated = otpResponse?.rows[0]?.code;


    console.log(otpCodeGenerated)
    console.log(otpCodeInput)

    if (otpCodeGenerated != otpCodeInput) throw boom.forbidden("Invalid code");

    const otpCodeUsed = otpResponse?.rows[0]?.used;


    if (otpCodeUsed) throw boom.conflict("You already used this code");

    await pool.query(`CALL verify_member($1, $2)`, [
      emailToVerify,
      emailToVerify,
    ]);

    res.sendStatus(200).json({"message": "Account verified successfully"})
  } catch (error) {
    next(error);
  }
};

export const verifyEmailByAdmin = async (req, res, next) => {
  try {
    const emailToVerify = req.body.emailToVerify;
    const verificationStatus = req.body.verificationStatus;

    const memberFound = await pool.query(
      `SELECT verified, role FROM v_member WHERE email = $1`,
      [emailToVerify]
    );

    if (memberFound.rows.lenght == 0)
      throw boom.badRequest("This member doesn't exist");

    if (memberFound.rows[0].role !== "MEMBER") {
      if (emailToVerify !== process.env.ADMINEMAIL)
        throw boom.unauthorized("You can't do this!");

      await pool.query(`CALL verify_member($1, $2, $3)`, [
        req.memberEmail,
        emailToVerify,
        verificationStatus,
      ]);
      res.send("This account was verified successfully!");
    } else {
      await pool.query(`CALL verify_member($1, $2, $3)`, [
        req.memberEmail,
        emailToVerify,
        verificationStatus,
      ]);
      res.send("This account was verified successfully!");
    }
  } catch (error) {
    next(error);
  }
};
