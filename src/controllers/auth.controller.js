import { pool } from '../database';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../config';

const encryptPassword = async (password) =>{
    const salt = await bycrypt.genSalt(10, password);

    return bycrypt.hash(password, salt);
};

const comparePassword = async (password, receivedPassword) => {
    return await bycrypt.compare(password, receivedPassword);
};

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    if(email == null) return res.status(400).json({menssage:"Email Undefinded"});

    if(password == null) return res.status(400).json({menssage:"Password Undefinded"});

    if(name == null) return res.status(400).json({menssage:"Name Undefinded"});

    const response = await pool.query(`CALL signup_member('${email}', '${await encryptPassword(password)}', '${name}')`);

    await console.log(response);
    

    const token = jwt.sign({email: email}, config.SECRET, {
        expiresIn: 86400 // 24 hours
    })

    res.json({token});



};

export const signin = async (req, res) => {

    const {email, password} = req.body;
    
    // VERIFYING IF THE MEMBER EXISTS ON THE DATA BASE
    const userFound = await pool.query(`SELECT * FROM member WHERE email= $1;`, [email]); 
    
    if(userFound.rows.length == 0) return res.status(400).json({message: "Member not found"});

    // COMPARING THE PASSWORD 
    const matchPassword = await comparePassword(password, userFound.rows[0].password);
    
    // IF IT'S TRUE RETURN MEMBER'S DATA
    if(!matchPassword) return res.status(401).json({token: null, message:"Password is incorrect"});
    
    console.log(userFound.rows);

    const token = jwt.sign({email: userFound.rows[0].email}, config.SECRET, {
        expiresIn: 86400
    })

    await pool.query(`INSERT INTO login_historial (email_member, log_date) VALUES ($1, NOW())`, [userFound.rows[0].email]); 


    res.status(200).json({token: token})

};