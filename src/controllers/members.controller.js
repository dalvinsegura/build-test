import { pool } from '../database';

export const signupMember = async (req, res) => {

    const { email, password, name} = req.body;

    console.log(email, password, name);   

    res.json("Signing up member");

    const response = await pool.query(`CALL signup_member('${email}', '${password}', '${name}')`);

    await console.log(response);
    

};

export const getMembers = async (req, res) => {
    const response = await pool.query('SELECT * FROM v_member');
    

    res.send(response.rows);

};

export const getMemberById = async (req, res) => {
    const response = await pool.query(`SELECT * FROM member WHERE id = ${req.params.memberId}`);
    res.send(response.rows);

};

export const updateMembersById = (req, res) => {

};

export const deleteMemberById = async (req, res) => {
    const {memberDelete} = req.body;

    const roleFound = await pool.query(`SELECT role FROM member WHERE email = $1`, [memberDelete]);
    
    console.log(req.memberEmail)
    console.log(memberDelete)
    console.log(roleFound.rows[0].role)

    if(roleFound.rows[0].role == "ADMIN" || roleFound.rows[0].role == "INSPECTOR") return res.status(423).json({message: "You are not allowed to delete this member."});
    
    
    await pool.query(`CALL member_remover('${req.memberEmail}', '${memberDelete}')`);
    res.json("Member was deleted");

};




