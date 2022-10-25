import { pool } from "../database";
import config from "../config";

export const switchToFreeMembership = async (req, res) => {
  try {
    const { giveFreeMembershipTo } = req.body;

    let membershipType = await pool.query(
      `SELECT membership_type FROM v_member WHERE email = $1`,
      [giveFreeMembershipTo]
    );

    if (membershipType.rows.length !== 1)
      return res.status(404).json({
        menssage:
          "The user '" +
          giveFreeMembershipTo +
          "' you are trying to give a free membership doesn't exisit",
      });

    membershipType = membershipType.rows[0].membership_type;

    function addMonths(numOfMonths, date = new Date()) {
      date.setMonth(date.getMonth() + numOfMonths);
      return date;
    }

    if (membershipType == "GRATIS")
      return res
        .status(406)
        .json({ menssage: "You already have a free membership" });

    console.log("Llego aqui");
    await pool.query(
      `call assign_free_membership($1, $2)
          `,
      [req.memberEmail, giveFreeMembershipTo]
    );
    res.status(200).json({ menssage: `Membership switched successfull` });
  } catch (error) {
    res.send(error);
  }
};

export const switchMembershipStatus = async (req, res) => {
  try {
    const { switchMembershipStatusTo, newStatus } = req.body;

    let membershipStatus = await pool.query(
      `SELECT membership_status FROM v_member WHERE email = $1`,
      [switchMembershipStatusTo]
    );

    if (membershipStatus.rows.length !== 1)
      return res.status(404).json({
        menssage:
          "Memebership wasn't changed because this member doesn't exist",
      });

    membershipStatus = membershipStatus.rows[0].membership_status;
    console.log(req.body.switchMembershipStatusTo);
    if (req.body.switchMembershipStatusTo == config.ADMINEMAIL)
      return res
        .status(400)
        .json({ menssage: "You can't alterate this member" });

    await pool.query(`CALL status_membership_updater($1, $2, $3)`, [
      req.memberEmail,
      switchMembershipStatusTo,
      newStatus,
    ]);
    res.status(200).json({
      menssage: "The status of this membership was switch successfully",
    });
  } catch (error) {
    res.send(error);
  }
};

export const getMembership = async (req, res) => {
  try {
    console.log(req.memberRole);

    if (req.memberRole == "ADMIN") {
      const responseForAdmin = await pool.query(
        "SELECT email, name, membership_type, membership_started, membership_finished, membership_status FROM v_member"
      );

      console.log("Pasando por Admin");

      res.send(responseForAdmin.rows);
    } else if (req.memberRole == "MEMBER") {
      const responseForMember = await pool.query(
        `SELECT email, name, membership_type, membership_started, membership_finished, membership_status FROM v_member WHERE email = $1`,
        [req.memberEmail]
      );
      console.log("Pasando por member");
      res.send(responseForMember.rows[0]);
    } else {
      return res
        .status(400)
        .json({ menssage: "There's something wrong with your role" });
    }
  } catch (error) {
    res.send(error);
  }
};
