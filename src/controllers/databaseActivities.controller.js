import { pool } from "../database";

export const getDatabaseActivities = async (req, res, next) => {
try {
  console.log(req.memberRole);
  const response = await pool.query("SELECT * FROM v_database_activities");
  res.status(200).send(response.rows);
} catch (error) {
  next(error);
}
};
