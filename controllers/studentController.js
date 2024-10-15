const pool = require ('../Config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllStudents = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT lname, fname, mname,user_id,course_id, created_at, updated_at FROM  students');
        res.json(rows);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getStudentsById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT lname, fname, mname,user_Id,course_id, created_at, updated_at FROM users WHERE student_id = ?', [id]);
        
        if (rows.length === 0 ) {
            return res.status(404).json ({ error: 'User not found' });
        }

        res.json(rows[0]);
    }catch (err) {
        res.status(500).json({ error: err.message});
    }
};

const createStudents = async (req, res) => {
    const {lname, fname, mname, user_id, course_id } = req.body;

    try {
        const [result] = await pool.query('INSERT INTO students (lname, fname, mname, user_id, course_id) VALUES (?, ?, ?, ?, ?)', [lname,fname,mname, user_id, course_id]);
        res.status(201).json({ id: result.insertId, lname, fname, mname, user_id, course_id});

    }catch (err) {
        res.status(500).json({ error: err.message });

    }
};

const updateStudents = async (req, res) => {
    const { id } = req.params;
    const { lname, fname,mname } = req.body;

    try { 

        const [result] = await pool.query ('UPDATE students SET lname = ? , fname = ?, mname = ?  WHERE student_id = ?', [lname,fname,mname, id]);

    if (result.affectedRows === 0 ) {
        return res.status(404).json({ error: 'User not found'});
    }
    res.json({ message: 'User updated Successfully'});
    }catch (err) {
        res.status(500).json ({ error: err.message});
    }
};

const deleteStudents = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM students WHERE student_id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json ({ error: 'User not found' });
        }

        res.json({ message: 'User deleted Successfully' });

    }catch (err) {
        res.status(500).json({ error: err.message});
    }
};

module.exports = {getAllStudents, getStudentsById, createStudents, updateStudents, deleteStudents};
