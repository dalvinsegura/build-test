import { pool } from "../database";

export const getLoginHistorial = async (req, res) => {
  if (req.memberRole == "ADMIN" || req.memberRole == "INSPECTOR") {
    const response = await pool.query("SELECT * FROM v_login_historial");
    return res.send(response.rows);
  } else if (req.memberRole == "MEMBER") {
    const response = await pool.query(
      `SELECT * FROM v_login_historial WHERE email_member = $1`,
      [req.memberEmail]
    );
    return res.send(response.rows);
  } else {
    return res.status(403).json({ menssage: "You don't have enought role" });
  }
};
