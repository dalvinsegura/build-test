import jwt from "jsonwebtoken";
import { pool } from "../database";
import boom from "@hapi/boom";

import * as dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log(authHeader)

    if (!authHeader) throw boom.conflict("Not token provided");

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.SECRET,
      async (err, decoded) => {
        try {
          if (err) throw boom.forbidden("Token expired/invalid"); //invalid token

        req.memberEmail = decoded.email;

        const memberFound = await pool.query(
          `SELECT email, role, membership_type FROM v_member WHERE email = $1;`,
          [req.memberEmail]
        );

        if (memberFound.rows.length == 0) throw boom.unauthorized();

        req.memberRole = memberFound.rows[0].role;
        req.memberMembershipType = memberFound.rows[0].membership_type;

        next();
        } catch (error) {
          next(error)
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.memberRole !== "ADMIN")
      throw boom.unauthorized("You're are not an administrator");

    next();
  } catch (error) {
    next(error);
  }
};

export const isPremium = async (req, res, next) => {
  try {
    const memberFound = await pool.query(
      `SELECT * FROM v_member WHERE email = $1`,
      [req.body.email]
    );

    const roleMember = memberFound.rows[0].role;
    const membership_type = memberFound.rows[0].membership_type;

    const m_started = new Date(memberFound.rows[0].membership_started)
      .toISOString()
      .split("T")[0];
    const m_finished = new Date(memberFound.rows[0].membership_finished)
      .toISOString()
      .split("T")[0];
    const currentDate = new Date().toISOString().split("T")[0];

    const m_status = memberFound.rows[0].membership_status;

    // CHECKING IF THE STATUS MEMBERSHIP STILL ACITVE OR INACTIVE
    if (m_status !== "ACTIVA")
      throw boom.conflict("Your membership is not active");

    if (roleMember == "ADMIN") return next();

    // CHECKING IF THE PREMIUM MEMBERS KEEP THEIR MEMBERSHIP ACTIVED
    if (membership_type == "PREMIUM") {
      // CHECK IF THE MEMBER EXPIRED, IF IT'S TRUE WILL BE UPDATED TO GRATIS
      if (m_finished <= currentDate) {
        await pool.query(`CALL assign_free_membership($1, $1);`, [
          req.body.email,
        ]);

        throw boom.conflict(`Your membership has expired at ${currentDate}`);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
