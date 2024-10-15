const pool = require ('../Config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllCourses = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT course_id, course_code, course_name,dept_id,user_id, created_at, updated_at FROM  courses');
        res.json(rows);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCoursesById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT course_id, course_code, course_name, created_at, updated_at FROM users WHERE course_id = ?', [id]);
        
        if (rows.length === 0 ) {
            return res.status(404).json ({ error: 'User not found' });
        }

        res.json(rows[0]);
    }catch (err) {
        res.status(500).json({ error: err.message});
    }
};

const createCourses = async (req, res) => {
    const {course_code, course_name, dept_id,user_id } = req.body;

    try {
        const [result] = await pool.query('INSERT INTO courses (course_code, course_name, dept_id, user_id) VALUES (?, ?, ?, ?)', [course_code,course_name, dept_id, user_id]);
        res.status(201).json({ id: result.insertId, course_code, course_name, dept_id, user_id});

    }catch (err) {
        res.status(500).json({ error: err.message });

    }
};

const updateCourses = async (req, res) => {
    const { id } = req.params;
    const { course_code, course_name } = req.body;

    try { 

        const [result] = await pool.query ('UPDATE courses SET course_code = ? , course_name = ? WHERE course_id = ?', [course_code,course_name,id]);

    if (result.affectedRows === 0 ) {
        return res.status(404).json({ error: 'User not found'});
    }
    res.json({ message: 'User updated Successfully'});
    }catch (err) {
        res.status(500).json ({ error: err.message});
    }
};

const deleteCourses = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM courses WHERE course_id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json ({ error: 'User not found' });
        }

        res.json({ message: 'User deleted Successfully' });

    }catch (err) {
        res.status(500).json({ error: err.message});
    }
};

module.exports = {getAllCourses, getCoursesById, createCourses, updateCourses, deleteCourses};
