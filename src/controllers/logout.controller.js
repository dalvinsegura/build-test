import boom from "@hapi/boom";
import { pool } from "../database";

export const handleLogout = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);
    
    const refreshToken = cookies.jwt;
    
    const foundMember = await pool.query(
      `SELECT email FROM v_member WHERE refresh_token = $1`,
      [refreshToken]
      );

      if (!foundMember) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        throw boom.forbidden();
      }
      
      console.log({fisrt: true})
    // Delete refreshToken in DB

    await pool.query(`CALL delete_refreshtoken($1)`, [
      foundMember.rows[0].email,
    ]);

    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    console.log({second: true})

    res.clearCookie('jwt', { httpOnly: true});
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
