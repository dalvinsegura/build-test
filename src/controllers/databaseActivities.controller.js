import { pool } from "../database";

export const getDatabaseActivities = async (req, res) => {
  console.log(req.memberRole);
  const response = await pool.query("SELECT * FROM v_database_activities");
  res.send(response.rows);
};
