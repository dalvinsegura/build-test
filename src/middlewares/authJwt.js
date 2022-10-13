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
  if (req.memberRole !== "ADMIN")
    return res.status(406).json({ message: "You're are not an administrator" });

  next();
};

export const isPremium = async (req, res, next) => {
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
  
  console.log(currentDate, roleMember, membership_type, m_started, m_finished);
  


  // CHECKING IF THE STATUS MEMBERSHIP STILL ACITVE OR INACTIVE
  if(m_status !== "ACTIVA") return res.status(403).json({message: "Your membership is not active"});

  // CHECKING IF THE PREMIUM MEMBERS KEEP THEIR MEMBERSHIP ACTIVED
  if (membership_type == "PREMIUM") {
    
    // CHECK IF THE MEMBER EXPIRED, IF IT'S TRUE WILL BE UPDATED TO GRATIS
    if (m_finished <= currentDate) {
      await pool.query(`CALL assign_free_membership($1, $1);`, [
        req.body.email,
      ]);

      return res.json({
        message: "Your membership has expired at " + currentDate,
      });
    }
  }
  next();
};
