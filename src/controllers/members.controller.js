import { pool } from '../database';

export const signupMember = async (req, res) => {

    const { email, password, name} = req.body;

    console.log(email, password, name);   

    res.json("Signing up member");

    const response = await pool.query(`CALL signup_member('${email}', '${password}', '${name}')`);

    await console.log(response);
    

};

export const getMembers = async (req, res) => {
    const response = await pool.query('SELECT * FROM member');
    

    res.send(response.rows);

};

export const getMemberById = async (req, res) => {
    const response = await pool.query(`SELECT * FROM member WHERE id = ${req.params.memberId}`);
    res.send(response.rows);

};

export const updateMembersById = (req, res) => {

};

export const deleteMemberById = async (req, res) => {

    const {memberLoggedIn, memberDelete} = req.body;
    res.json("Deleting member");


    const response = await pool.query(`CALL member_remover('${memberLoggedIn}', '${memberDelete}')`);
    await console.log(response);

};




