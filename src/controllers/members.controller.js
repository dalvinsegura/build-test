import { pool } from "../database";
import boom from "@hapi/boom"; 

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

    if(roleFound.rows == 0) throw boom.forbidden("This member doesn't exists");

    if (roleFound.rows[0].role == "ADMIN")
      throw boom.unauthorized("You can't remove an Administrator");

    await pool.query(`CALL member_remover($1, $2)`, [
      req.memberEmail,
      memberDelete,
    ]);
    res.status(200).json("Member was deleted successfully");
  } catch (error) {
    next(error);
  }
};
