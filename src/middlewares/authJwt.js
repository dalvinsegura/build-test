import jwt from "jsonwebtoken";
import { pool } from "../database";
import config from "../config";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) return res.status(403).json({ message: "Not token provided" });
    // console.log(token);

    const decoded = jwt.verify(token, config.SECRET);

    req.memberEmail = decoded.email;

    const userFound = await pool.query(
      `SELECT email, role FROM member WHERE email= $1;`,
      [req.memberEmail]
    );

    if (userFound.rows.length == 0)
      return res.status(404).json({ message: "Member not found" });

      req.memberRole = userFound.rows[0].role;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};


export const isAdmin = async (req, res, next) => {
    if(req.memberRole !== "ADMIN") return res.status(406).json({message: "You're are not an administrator"});

    next();
    
};