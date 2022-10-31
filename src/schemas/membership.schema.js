import Joi from "joi";

const giveFreeMembershipTo = Joi.string().email();
const memberEmail = Joi.string().email();
const switchMembershipStatusTo = Joi.string().email();
const newStatus = Joi.string().min(6).max(8);

export const switchToFreeMembership = Joi.object({
  giveFreeMembershipTo: giveFreeMembershipTo.required(),
  memberEmail: memberEmail,
});

export const switchMembershipStatus = Joi.object({
  switchMembershipStatusTo: switchMembershipStatusTo.required(),
  memberEmail: memberEmail,
  newStatus: newStatus.required(),
});

export const getMembership = Joi.object({
  memberEmail: memberEmail,
});
