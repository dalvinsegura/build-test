import { pool } from "../database";
import boom from "@hapi/boom";

export const signupMember = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const response = await pool.query(
      `CALL signup_member('${email}', '${password}', '${name}')`
    );

    res.status(204).json({ message: "You were signed up successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (req, res, next) => {
  try {
    const response = await pool.query("SELECT * FROM v_member");
    res.status(200).send(response.rows);
  } catch (error) {
    next(error);
  }
};

export const getMemberByEmail = async (req, res, next) => {
  try {
    const response = await pool.query(
      `SELECT * FROM v_member WHERE email = $1`,
      [req.memberEmail]
    );
    res.status(200).send(response.rows);
  } catch (error) {
    next(error);
  }
};

export const deleteMemberById = async (req, res, next) => {
  try {
    const { memberDelete } = req.body;

    const roleFound = await pool.query(
      `SELECT role FROM member WHERE email = $1`,
      [memberDelete]
    );

    if (roleFound.rows[0].role == "ADMIN")
      throw boom.unauthorized("You can't remove an Administrator");

    await pool.query(`CALL member_remover($1, $2)`, [
      req.memberEmail,
      memberDelete,
    ]);
    res.status(204).json("Member was deleted successfully");
  } catch (error) {
    next(error);
  }
};
