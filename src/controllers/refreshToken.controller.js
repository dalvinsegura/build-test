import { pool } from "../database";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import IP from "ip";
import boom from "@hapi/boom";
import nodemailer from "nodemailer";

import * as dotenv from "dotenv";
dotenv.config();

export const handleRefreshToken = async (req, res, next) => {
    try {
      const cookies = req.cookies;
  
      if(!cookies?.jwt) throw boom.unauthorized();
      console.log(cookies.jwt);

      const refreshToken = cookies.jwt;

      const token = jwt.sign(
        { email: memberFound.rows[0].email },
        process.env.SECRET,
        {
          expiresIn: 86400,
        }
      );
  

    } catch (error) {
      next(error);
    }
  };