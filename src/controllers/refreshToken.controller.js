import { pool } from "../database";
import jwt from "jsonwebtoken";
import boom from "@hapi/boom";

import * as dotenv from "dotenv";
dotenv.config();

export const handleRefreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) throw boom.unauthorized();
    
    const refreshToken = cookies.jwt;
    
    
    const foundMember = await pool.query(
      `SELECT email, role FROM v_member WHERE refresh_token = $1`,
      [refreshToken]
      );

      const role = foundMember.rows[0].role;

      if (!foundMember) throw boom.forbidden();
      
      jwt.verify(
        refreshToken,
        process.env.REFESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || foundMember.rows[0].email !== decoded.email)
          throw boom.forbidden();
          
        const accessToken = jwt.sign(
          { email: decoded.email },
          process.env.SECRET,
          { expiresIn: "10s" }
        );
        res.json({ role, accessToken });
      }
    );
  } catch (error) {
    next(error);
  }
};
