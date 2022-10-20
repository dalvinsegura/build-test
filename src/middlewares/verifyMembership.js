import { pool } from "../database";

export const isActiveMembership = async (req, res, next) => {
  let membershipStatus = await pool.query(
    `SELECT membership_status FROM v_member WHERE email = $1`,
    [req.memberEmail]
  );

  membershipStatus = membershipStatus.rows[0].membership_status;

  if (membershipStatus !== "ACTIVA")
    return res.status(403).json({ message: "Your membership is not active" });

  next();
};
