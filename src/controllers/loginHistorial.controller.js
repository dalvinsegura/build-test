import { pool } from "../database";
import boom from "@hapi/boom";

export const getLoginHistorial = async (req, res, next) => {
  try {
    if (req.memberRole == "ADMIN") {
      const response = await pool.query("SELECT * FROM v_login_historial");

      if (response.rows.length == 0)
        throw boom.notFound("Login historial is empty");

      return res.status(200).send(response.rows);
    } else if (req.memberRole == "MEMBER") {
      const response = await pool.query(
        `SELECT * FROM v_login_historial WHERE email_member = $1`,
        [req.memberEmail]
      );

      if (response.rows.length == 0)
        throw boom.notFound("Login historial is empty");

      return res.status(200).send(response.rows);
    } else {
      throw boom.unauthorized("You don't have enought role");
    }
  } catch (error) {
    next(error);
  }
};
