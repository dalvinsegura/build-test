import { pool } from "../database";
import boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const verifyEmailByEmail = async (req, res, next) => {
  try {
    const emailToken = req.body.token || req.params.emailToken || req.headers[ "x-access-token" ]; 

    const decoded = jwt.verify(emailToken, process.env.SECRET);

    const emailDecoded = decoded.email;

    const memberFound = await pool.query(
      `SELECT verified FROM v_member WHERE email = $1`,
      [emailDecoded]
    );

    if (memberFound.rows.lenght == 0)
      throw boom.badRequest("There's something wrong with your signing up!");
    if (memberFound.rows[0].verified !== false)
      throw boom.badRequest("Your account is already verified!");

    await pool.query(`CALL verify_member($1)`, [emailDecoded]);
    res.send("You account were verified successfully!");
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
    
    if(memberFound.rows[0].role !== "MEMBER") {

        if(emailToVerify == process.env.ADMINEMAIL) throw boom.unauthorized("You can't do this!");

        await pool.query(`CALL verify_member($1, $2, $3)`, [req.memberEmail, emailToVerify, verificationStatus]);
        res.send("This account was verified successfully!");
    }else{
        await pool.query(`CALL verify_member($1, $2, $3)`, [req.memberEmail, emailToVerify, verificationStatus]);
        res.send("This account was verified successfully!");
    }


  } catch (error) {
    next(error);
  }
};
