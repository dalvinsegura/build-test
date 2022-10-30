import { pool } from "../database";
import boom from "@hapi/boom";
import * as dotenv from "dotenv";
dotenv.config();

export const switchToFreeMembership = async (req, res, next) => {
  try {
    const { giveFreeMembershipTo } = req.body;

    let membershipType = await pool.query(
      `SELECT membership_type FROM v_member WHERE email = $1`,
      [giveFreeMembershipTo]
    );

    if (membershipType.rows.length !== 1)
      throw boom.notFound(
        `The user '${giveFreeMembershipTo}' you are trying to give a free membership doesn't exisit`
      );

    membershipType = membershipType.rows[0].membership_type;

    function addMonths(numOfMonths, date = new Date()) {
      date.setMonth(date.getMonth() + numOfMonths);
      return date;
    }

    if (membershipType == "GRATIS")
      throw boom.conflict("You already have a free membership");

    await pool.query(`call assign_free_membership($1, $2)`, [
      req.memberEmail,
      giveFreeMembershipTo,
    ]);

    res
      .status(200)
      .json({ message: `Membership switched to FREE successfull` });
  } catch (error) {
    next(error);
  }
};

export const switchMembershipStatus = async (req, res, next) => {
  try {
    const { switchMembershipStatusTo, newStatus } = req.body;

    let membershipStatus = await pool.query(
      `SELECT membership_status FROM v_member WHERE email = $1`,
      [switchMembershipStatusTo]
    );

    if (membershipStatus.rows.length !== 1)
      throw boom.notFound("Member not found");

    console.log("ola");

    membershipStatus = membershipStatus.rows[0].membership_status;

    if (req.body.switchMembershipStatusTo == process.env.ADMINEMAIL)
      throw boom.forbidden("You can't alterate this member");

    await pool.query(`CALL status_membership_updater($1, $2, $3)`, [
      req.memberEmail,
      switchMembershipStatusTo,
      newStatus,
    ]);
    res.status(200).json({
      message: `The status of this membership was switch to '${newStatus}' successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const getMembership = async (req, res, next) => {
  try {
    if (req.memberRole == "ADMIN") {
      const responseForAdmin = await pool.query(
        "SELECT email, name, membership_type, membership_started, membership_finished, membership_status FROM v_member"
      );

      res.status(200).send(responseForAdmin.rows);
    } else if (req.memberRole == "MEMBER") {
      const responseForMember = await pool.query(
        `SELECT email, name, membership_type, membership_started, membership_finished, membership_status FROM v_member WHERE email = $1`,
        [req.memberEmail]
      );

      res.status(200).send(responseForMember.rows[0]);
    } else {
      throw boom.unauthorized("There's something wrong with your role");
    }
  } catch (error) {
    next(error);
  }
};
